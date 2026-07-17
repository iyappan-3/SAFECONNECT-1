# GovFind - Local Installation & Setup Guide

This guide describes how to set up the GovFind platform (Spring Boot backend, React web portal, and MySQL database) in a local development environment.

## Prerequisites

Ensure you have the following installed on your system:
- **Java Development Kit (JDK) 21** or higher
- **Node.js** (v18.0.0+ or v20.0.0+) & npm (v9.0.0+)
- **MySQL Server 8.0** or higher
- **Flutter SDK** (v3.16.0+ for Material 3 rendering)
- **Maven 3.8+** (or use the provided Maven wrapper `mvnw`)

---

## 1. Database Setup (MySQL)

1. Connect to your local MySQL instance as root or an admin user:
   ```bash
   mysql -u root -p
   ```

2. Create the `govfind` database:
   ```sql
   CREATE DATABASE govfind CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. Import the database schema and seed data:
   ```bash
   mysql -u root -p govfind < govfind/database/schema.sql
   ```

---

## 2. Spring Boot Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd govfind/backend
   ```

2. Configure the database connection parameters in `src/main/resources/application.properties` (or `application.yml`):
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/govfind?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=YourSecurePassword
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

   # Hibernate configuration
   spring.jpa.hibernate.ddl-auto=validate
   spring.jpa.show-sql=false
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

   # JWT Properties
   jwt.secret=9a3f2b7c4245ce82df770cf41d24ef01824792bf9810a908f0291e237372cf9a
   jwt.expiration-seconds=3600
   ```

3. Build and compile the Spring Boot application using Maven:
   ```bash
   ./mvnw clean install
   ```

4. Boot the server:
   ```bash
   ./mvnw spring-boot:run
   ```
   The backend will start and bind to `http://localhost:8080`.

---

## 3. React Web Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd govfind/frontend-web
   ```

2. Copy the example environment variables file and update it:
   ```bash
   cp .env.example .env
   ```
   Configure the API URL:
   ```env
   VITE_API_URL=http://localhost:8080/api/v1
   ```

3. Install all required dependencies:
   ```bash
   npm install
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   The web portal will run locally at `http://localhost:3000`.

---

## 4. Flutter Mobile App Setup

1. Navigate to the mobile app directory:
   ```bash
   cd govfind/mobile-app
   ```

2. Ensure your Flutter environment is active and healthy:
   ```bash
   flutter doctor
   ```

3. Fetch packages:
   ```bash
   flutter pub get
   ```

4. To launch the Flutter application on an iOS Simulator or Android Emulator:
   ```bash
   flutter run
   ```
