import React, { useState } from 'react';
import { File, Folder, FolderOpen, Copy, Check, Terminal, ExternalLink } from 'lucide-react';

interface CodeFile {
  name: string;
  path: string;
  language: string;
  content: string;
}

const PROJECT_FILES: Record<string, CodeFile> = {
  'database-sql': {
    name: 'schema.sql',
    path: '/govfind/database/schema.sql',
    language: 'sql',
    content: `-- GovFind Database Schema (MySQL)
-- Secure Police-Citizen Communication and Case Management Platform
-- For Government-Authorized Deployment Only

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS complaints;
DROP TABLE IF EXISTS evidence;
DROP TABLE IF EXISTS case_updates;
DROP TABLE IF EXISTS cases;
DROP TABLE IF EXISTS missing_persons;
DROP TABLE IF EXISTS vehicles;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS police_officers;
DROP TABLE IF EXISTS citizens;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS police_stations;
DROP TABLE IF EXISTS districts;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Districts
CREATE TABLE districts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Police Stations
CREATE TABLE police_stations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    district_id INT NOT NULL,
    address TEXT NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Users (Base table for authentication)
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('CITIZEN', 'POLICE', 'ADMIN') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_username (username),
    INDEX idx_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Citizens
CREATE TABLE citizens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    national_id VARCHAR(50) NOT NULL UNIQUE,
    phone_number VARCHAR(20) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Police Officers
CREATE TABLE police_officers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    badge_number VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    rank_title VARCHAR(100) NOT NULL,
    station_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (station_id) REFERENCES police_stations(id) ON DELETE RESTRICT,
    INDEX idx_badge_number (badge_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Reports (Submitted by citizens)
CREATE TABLE reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    citizen_id BIGINT NOT NULL,
    report_type ENUM('CRIME', 'MISSING_PERSON', 'LOST_VEHICLE', 'MISC') NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    district_id INT NOT NULL,
    incident_date TIMESTAMP NOT NULL,
    gps_latitude DECIMAL(10, 8),
    gps_longitude DECIMAL(11, 8),
    status ENUM('SUBMITTED', 'UNDER_REVIEW', 'CASE_CREATED', 'REJECTED') DEFAULT 'SUBMITTED',
    anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (citizen_id) REFERENCES citizens(id) ON DELETE CASCADE,
    FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE RESTRICT,
    INDEX idx_report_status (status),
    INDEX idx_report_type (report_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
  },
  'backend-user': {
    name: 'User.java',
    path: '/govfind/backend/src/main/java/gov/find/entity/User.java',
    language: 'java',
    content: `package gov.find.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum Role {
        CITIZEN,
        POLICE,
        ADMIN
    }
}`
  },
  'backend-report': {
    name: 'Report.java',
    path: '/govfind/backend/src/main/java/gov/find/entity/Report.java',
    language: 'java',
    content: `package gov.find.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "citizen_id", nullable = false)
    private Long citizenId;

    @Enumerated(EnumType.STRING)
    @Column(name = "report_type", nullable = false, length = 30)
    private ReportType reportType;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "district_id", nullable = false)
    private Integer districtId;

    @Column(name = "incident_date", nullable = false)
    private LocalDateTime incidentDate;

    @Column(name = "gps_latitude")
    private Double gpsLatitude;

    @Column(name = "gps_longitude")
    private Double gpsLongitude;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private Status status = Status.SUBMITTED;

    @Column(nullable = false)
    private Boolean anonymous = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum ReportType {
        CRIME,
        MISSING_PERSON,
        LOST_VEHICLE,
        MISC
    }

    public enum Status {
        SUBMITTED,
        UNDER_REVIEW,
        CASE_CREATED,
        REJECTED
    }
}`
  },
  'backend-security': {
    name: 'SecurityConfig.java',
    path: '/govfind/backend/src/main/java/gov/find/config/SecurityConfig.java',
    language: 'java',
    content: `package gov.find.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF as we use stateless JWT
            .cors(cors -> cors.configure(http)) // Allow React and Flutter origins
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll() // Authenticate & register
                .requestMatchers("/api/v1/citizen/**").hasRole("CITIZEN") // Citizen services
                .requestMatchers("/api/v1/police/**").hasRole("POLICE") // Police services
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN") // Admin console
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12); // Secure BCrypt Password Hashing with strength 12
    }
}`
  },
  'backend-controller': {
    name: 'CitizenController.java',
    path: '/govfind/backend/src/main/java/gov/find/controller/CitizenController.java',
    language: 'java',
    content: `package gov.find.controller;

import gov.find.entity.Report;
import gov.find.entity.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/citizen")
public class CitizenController {

    @PostMapping("/reports")
    public ResponseEntity<?> createReport(
            @AuthenticationPrincipal User currentUser,
            @RequestParam("reportType") String reportType,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("districtId") Integer districtId,
            @RequestParam("incidentDate") String incidentDate,
            @RequestParam(value = "gpsLatitude", required = false) Double gpsLatitude,
            @RequestParam(value = "gpsLongitude", required = false) Double gpsLongitude,
            @RequestParam(value = "anonymous", defaultValue = "false") Boolean anonymous,
            @RequestParam(value = "evidenceFiles", required = false) MultipartFile[] evidenceFiles) {

        try {
            Report report = new Report();
            report.setCitizenId(currentUser.getId());
            report.setReportType(Report.ReportType.valueOf(reportType));
            report.setTitle(title);
            report.setDescription(description);
            report.setDistrictId(districtId);
            report.setIncidentDate(LocalDateTime.parse(incidentDate));
            report.setGpsLatitude(gpsLatitude);
            report.setGpsLongitude(gpsLongitude);
            report.setAnonymous(anonymous);
            report.setStatus(Report.Status.SUBMITTED);

            if (evidenceFiles != null && evidenceFiles.length > 0) {
                for (MultipartFile file : evidenceFiles) {
                    String safeFileName = sanitizeFileName(file.getOriginalFilename());
                    System.out.println("Securely storing evidence: " + safeFileName);
                }
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(report);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Incident reporting failed.");
        }
    }
}`
  },
  'mobile-dart': {
    name: 'main.dart',
    path: '/govfind/mobile-app/lib/main.dart',
    language: 'dart',
    content: `import 'package:flutter/material.dart';

void main() {
  runApp(const GovFindApp());
}

class GovFindApp extends StatelessWidget {
  const GovFindApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'GovFind',
      debugShowCheckedModeBanner: false,
      themeMode: ThemeMode.system,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0F3D91),
          primary: const Color(0xFF0F3D91),
          secondary: const Color(0xFF2563EB),
          background: const Color(0xFFF8FAFC),
        ),
      ),
      home: const CitizenDashboardScreen(),
    );
  }
}`
  },
  'api-doc': {
    name: 'openapi.md',
    path: '/govfind/api-documentation/openapi.md',
    language: 'markdown',
    content: `# GovFind REST API Documentation (OpenAPI Blueprint)

- **Base URL**: \`https://api.govfind.gov/api/v1\`
- **Protocol**: HTTPS (MANDATORY in production)
- **Content-Type**: \`application/json\`

## Endpoint Summary

### 1. Authentication Service (\`/auth\`)

#### Register Citizen Account
- **Endpoint**: \`POST /auth/register\`
- **Access**: Public
- **Request Body**:
\`\`\`json
{
  "username": "citizen_robert",
  "email": "robert.davis@email.com",
  "password": "SecurePassword123!",
  "firstName": "Robert",
  "lastName": "Davis"
}
\`\`\`
- **Response (201 Created)**:
\`\`\`json
{
  "success": true,
  "message": "User registered successfully"
}
\`\`\``
  },
  'doc-install': {
    name: 'installation_guide.md',
    path: '/govfind/docs/installation_guide.md',
    language: 'markdown',
    content: `# GovFind - Local Installation & Setup Guide

Ensure you have the following installed on your system:
- **Java Development Kit (JDK) 21** or higher
- **Node.js** (v18.0.0+)
- **MySQL Server 8.0**
- **Flutter SDK**

## Database Setup

1. Connect to MySQL:
   \`\`\`bash
   mysql -u root -p
   \`\`\`
2. Create database:
   \`\`\`sql
   CREATE DATABASE govfind;
   \`\`\``
  },
  'doc-deploy': {
    name: 'deployment_guide.md',
    path: '/govfind/docs/deployment_guide.md',
    language: 'markdown',
    content: `# GovFind - Secure Production Deployment Guide

*   **Enforce HTTPS**: Set up SSL/TLS termination.
*   **JWT Secret Strength**: Store secret in cloud vault.
*   **Database Isolation**: Place MySQL in private VPC subnets.

## Kubernetes Deployment
\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: govfind-backend
spec:
  replicas: 3
\`\`\``
  }
};

export default function CodeExplorer() {
  const [selectedFileKey, setSelectedFileKey] = useState<string>('database-sql');
  const [copied, setCopied] = useState(false);

  const activeFile = PROJECT_FILES[selectedFileKey];

  const handleCopy = () => {
    if (activeFile) {
      navigator.clipboard.writeText(activeFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6" id="code-explorer-view">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* File Directory Column */}
        <div className="lg:col-span-1 bg-[#0F3D91] text-white rounded-xl p-4 space-y-4 shadow-sm border border-slate-200/10">
          <div className="border-b border-white/10 pb-3">
            <span className="text-[10px] text-blue-200 font-bold uppercase tracking-wider block">Production Workspaces</span>
            <h3 className="font-extrabold text-white font-sans text-sm flex items-center gap-1.5 mt-0.5">
              <Terminal className="w-4.5 h-4.5 text-blue-400" /> Repository File Tree
            </h3>
          </div>

          {/* Hierarchical Folder Structure representation */}
          <div className="space-y-3.5 text-xs">
            {/* Database Folder */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-blue-200/80 font-semibold uppercase text-[10px]">
                <FolderOpen className="w-3.5 h-3.5 text-blue-400" /> Database Config
              </div>
              <button
                onClick={() => setSelectedFileKey('database-sql')}
                className={`w-full flex items-center gap-2 pl-4 py-1.5 rounded-lg text-left transition cursor-pointer ${
                  selectedFileKey === 'database-sql' ? 'bg-[#2563EB] text-white font-bold' : 'hover:bg-white/10 text-blue-100'
                }`}
              >
                <File className="w-3.5 h-3.5 shrink-0" /> schema.sql
              </button>
            </div>

            {/* Spring Boot Backend Folder */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-blue-200/80 font-semibold uppercase text-[10px]">
                <FolderOpen className="w-3.5 h-3.5 text-emerald-400" /> Spring Boot Backend (Java 21)
              </div>
              <div className="pl-2 space-y-1">
                {[
                  { key: 'backend-user', name: 'User.java (JPA)' },
                  { key: 'backend-report', name: 'Report.java (JPA)' },
                  { key: 'backend-security', name: 'SecurityConfig.java' },
                  { key: 'backend-controller', name: 'CitizenController.java' }
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => setSelectedFileKey(item.key)}
                    className={`w-full flex items-center gap-2 pl-3 py-1.5 rounded-lg text-left transition cursor-pointer ${
                      selectedFileKey === item.key ? 'bg-[#2563EB] text-white font-bold' : 'hover:bg-white/10 text-blue-100'
                    }`}
                  >
                    <File className="w-3.5 h-3.5 shrink-0" /> {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Flutter Mobile App Folder */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-blue-200/80 font-semibold uppercase text-[10px]">
                <FolderOpen className="w-3.5 h-3.5 text-amber-400" /> Flutter Mobile (M3 Dart)
              </div>
              <button
                onClick={() => setSelectedFileKey('mobile-dart')}
                className={`w-full flex items-center gap-2 pl-4 py-1.5 rounded-lg text-left transition cursor-pointer ${
                  selectedFileKey === 'mobile-dart' ? 'bg-[#2563EB] text-white font-bold' : 'hover:bg-white/10 text-blue-100'
                }`}
              >
                <File className="w-3.5 h-3.5 shrink-0" /> main.dart
              </button>
            </div>

            {/* Documentation Folder */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-blue-200/80 font-semibold uppercase text-[10px]">
                <FolderOpen className="w-3.5 h-3.5 text-slate-400" /> Docs & OpenAPIs
              </div>
              <div className="pl-2 space-y-1">
                {[
                  { key: 'api-doc', name: 'openapi.md (Specs)' },
                  { key: 'doc-install', name: 'installation_guide.md' },
                  { key: 'doc-deploy', name: 'deployment_guide.md' }
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => setSelectedFileKey(item.key)}
                    className={`w-full flex items-center gap-2 pl-3 py-1.5 rounded-lg text-left transition cursor-pointer ${
                      selectedFileKey === item.key ? 'bg-[#2563EB] text-white font-bold' : 'hover:bg-white/10 text-blue-100'
                    }`}
                  >
                    <File className="w-3.5 h-3.5 shrink-0" /> {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* File Content Display Column */}
        <div className="lg:col-span-3 flex flex-col bg-slate-950 text-slate-200 rounded-xl overflow-hidden shadow-xl border border-slate-800">
          {/* Code Viewer Header ribbon */}
          <div className="bg-slate-900 border-b border-slate-800 px-5 py-3.5 flex justify-between items-center text-xs">
            <div className="flex items-center gap-2 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="text-slate-400 font-bold ml-2">{activeFile?.path}</span>
            </div>

            <button
              onClick={handleCopy}
              className="text-[11px] font-bold text-slate-400 hover:text-white flex items-center gap-1.5 bg-slate-850 px-3 py-1.5 rounded-md hover:bg-slate-800 transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Code
                </>
              )}
            </button>
          </div>

          {/* Code editor content viewer */}
          <div className="p-5 font-mono text-xs overflow-auto max-h-[500px] bg-slate-950 leading-relaxed text-slate-300 select-all whitespace-pre">
            {activeFile?.content}
          </div>

          {/* Footer informational */}
          <div className="bg-slate-900/50 border-t border-slate-800/60 px-5 py-2 text-[10px] text-slate-400 flex justify-between items-center">
            <span>Language: <span className="font-bold text-slate-200 uppercase">{activeFile?.language}</span></span>
            <span className="flex items-center gap-1 text-[9px] text-slate-500 font-bold uppercase"><ExternalLink className="w-3 h-3" /> Fully compiled to workspace</span>
          </div>
        </div>
      </div>
    </div>
  );
}
