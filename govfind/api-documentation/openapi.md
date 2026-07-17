# GovFind REST API Documentation (OpenAPI Blueprint)

GovFind backend exposes a secure REST API powered by Spring Boot, Spring Security, and JWT Authentication. This document provides developers with an overview of all endpoints, request payloads, response bodies, and role access matrices.

## API Specification

- **Base URL**: `https://api.govfind.gov/api/v1`
- **Protocol**: HTTPS (MANDATORY in production)
- **Content-Type**: `application/json`

---

## Security Headers

All requests to protected endpoints MUST include the JSON Web Token in the Authorization header:
```http
Authorization: Bearer <your_jwt_token_here>
```

---

## Endpoint Summary

### 1. Authentication Service (`/auth`)

#### Register Citizen Account
- **Endpoint**: `POST /auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "username": "citizen_robert",
  "email": "robert.davis@email.com",
  "password": "SecurePassword123!",
  "firstName": "Robert",
  "lastName": "Davis",
  "nationalId": "NID-9481948",
  "phoneNumber": "+1 (555) 012-3456",
  "address": "789 Pine Ave, Apt 4B, Capitol City"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "citizenId": 1
}
```

#### Login (Authenticate)
- **Endpoint**: `POST /auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "username": "citizen_robert",
  "password": "SecurePassword123!"
}
```
- **Response (200 OK)**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjaXRpemVuX3JvYmVydCIsImNvb...",
  "refreshToken": "df9a3f2b-7c42-45ce-82df-770cf41d24ef",
  "tokenType": "Bearer",
  "expiresInSeconds": 3600,
  "user": {
    "id": 4,
    "username": "citizen_robert",
    "email": "robert.davis@email.com",
    "role": "CITIZEN",
    "fullName": "Robert Davis"
  }
}
```

#### Refresh Token
- **Endpoint**: `POST /auth/refresh`
- **Access**: Public
- **Request Body**:
```json
{
  "refreshToken": "df9a3f2b-7c42-45ce-82df-770cf41d24ef"
}
```
- **Response (200 OK)**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9.new_access_token_payload...",
  "refreshToken": "df9a3f2b-7c42-45ce-82df-770cf41d24ef"
}
```

---

### 2. Citizen Services (`/citizen`)

#### Create Incident Report
- **Endpoint**: `POST /citizen/reports`
- **Access**: Citizen (Authenticated)
- **Request Body (Multipart Form Data)**:
  - `reportType`: `'CRIME' | 'MISSING_PERSON' | 'LOST_VEHICLE'`
  - `title`: `string`
  - `description`: `string`
  - `districtId`: `integer`
  - `incidentDate`: `ISO-8601 string`
  - `gpsLatitude`: `decimal (optional)`
  - `gpsLongitude`: `decimal (optional)`
  - `anonymous`: `boolean`
  - `evidenceFiles`: `File[] (optional, image/video/pdf)`
- **Response (201 Created)**:
```json
{
  "id": 15,
  "reportType": "CRIME",
  "title": "Armed Robbery at Convenience Store",
  "status": "SUBMITTED",
  "createdAt": "2026-07-16T21:17:09Z"
}
```

#### Get My Submissions
- **Endpoint**: `GET /citizen/reports`
- **Access**: Citizen (Authenticated - returns ONLY matching user ID)
- **Response (200 OK)**:
```json
[
  {
    "id": 15,
    "title": "Armed Robbery at Convenience Store",
    "reportType": "CRIME",
    "status": "CASE_CREATED",
    "createdAt": "2026-07-16T12:00:00Z",
    "case": {
      "caseNumber": "CASE-2026-9031",
      "status": "INVESTIGATING",
      "priority": "HIGH",
      "assignedOfficer": "John Miller (Badge-7402)"
    }
  }
]
```

#### Submit Complaint on Misconduct
- **Endpoint**: `POST /citizen/complaints`
- **Access**: Citizen (Authenticated)
- **Request Body**:
```json
{
  "officerNameOrBadge": "Officer John Miller",
  "title": "Unprofessional Language",
  "description": "During file check-in, the officer used aggressive tone..."
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "complaintId": 32,
  "status": "SUBMITTED"
}
```

---

### 3. Police Services (`/police`)

#### View Incoming Reports
- **Endpoint**: `GET /police/reports`
- **Access**: Police, Admin
- **Query Parameters**:
  - `districtId`: `integer (optional)`
  - `status`: `string (optional)`
  - `search`: `string (optional)`
- **Response (200 OK)**:
```json
[
  {
    "id": 15,
    "citizenName": "Robert Davis",
    "reportType": "CRIME",
    "title": "Convenience Store Robbery",
    "district": "Central District",
    "status": "SUBMITTED",
    "createdAt": "2026-07-16T21:17:00Z"
  }
]
```

#### Create Official Case from Report
- **Endpoint**: `POST /police/cases`
- **Access**: Police
- **Request Body**:
```json
{
  "reportId": 15,
  "priority": "HIGH",
  "assignedOfficerId": 1,
  "notes": "Reviewing security cameras nearby as the initial step."
}
```
- **Response (201 Created)**:
```json
{
  "caseId": 122,
  "caseNumber": "CASE-2026-9031",
  "status": "ASSIGNED"
}
```

#### Update Case Status and Timeline
- **Endpoint**: `PATCH /police/cases/{id}/status`
- **Access**: Police (Officer assigned or station Lead)
- **Request Body**:
```json
{
  "status": "INVESTIGATING",
  "timelineTitle": "Forensic Evidence Logged",
  "timelineDescription": "Fingerprints retrieved from counter. Sent to state lab for screening.",
  "notifyCitizen": true
}
```
- **Response (200 OK)**:
```json
{
  "caseId": 122,
  "currentStatus": "INVESTIGATING",
  "lastUpdated": "2026-07-16T21:18:00Z"
}
```

---

### 4. Admin Services (`/admin`)

#### Get Platform Analytics
- **Endpoint**: `GET /admin/analytics`
- **Access**: Admin (Authenticated)
- **Response (200 OK)**:
```json
{
  "totalCitizensRegistered": 12402,
  "totalPoliceOfficers": 354,
  "activeStations": 12,
  "reportsByStatus": {
    "SUBMITTED": 45,
    "UNDER_REVIEW": 12,
    "CASE_CREATED": 122,
    "REJECTED": 8
  },
  "casesByStatus": {
    "OPEN": 12,
    "ASSIGNED": 35,
    "INVESTIGATING": 60,
    "CLOSED": 15
  },
  "complaintsByStatus": {
    "SUBMITTED": 5,
    "UNDER_INVESTIGATION": 2,
    "RESOLVED": 15
  }
}
```

#### Database Backup
- **Endpoint**: `POST /admin/database/backup`
- **Access**: Admin (Authenticated)
- **Response (200 OK)**:
```json
{
  "success": true,
  "backupFileName": "govfind_prod_backup_20260716_2118.sql",
  "sizeBytes": 1840291,
  "timestamp": "2026-07-16T21:18:10Z"
}
```
