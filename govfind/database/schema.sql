-- GovFind Database Schema (MySQL)
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

-- 6. Admins
CREATE TABLE admins (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Reports (Submitted by citizens)
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Cases (Official police investigation files created from reports)
CREATE TABLE cases (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    report_id BIGINT NOT NULL UNIQUE,
    case_number VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    assigned_officer_id BIGINT,
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
    status ENUM('OPEN', 'ASSIGNED', 'INVESTIGATING', 'COLLECTING_EVIDENCE', 'SUSPENDED', 'CLOSED') DEFAULT 'OPEN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE RESTRICT,
    FOREIGN KEY (assigned_officer_id) REFERENCES police_officers(id) ON DELETE SET NULL,
    INDEX idx_case_number (case_number),
    INDEX idx_case_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Case Updates (Timeline tracking for the investigation)
CREATE TABLE case_updates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    case_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    updated_by_officer_id BIGINT NOT NULL,
    visible_to_citizen BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by_officer_id) REFERENCES police_officers(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Evidence (Media and attachments)
CREATE TABLE evidence (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    report_id BIGINT,
    case_id BIGINT,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(512) NOT NULL,
    file_type VARCHAR(100) NOT NULL, -- e.g. 'image/jpeg', 'video/mp4', 'application/pdf'
    file_size BIGINT NOT NULL,
    uploaded_by_user_id BIGINT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE SET NULL,
    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE SET NULL,
    FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Missing Persons details (Sub-type details linked to report)
CREATE TABLE missing_persons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    report_id BIGINT NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    age INT,
    gender ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,
    last_seen_wearing TEXT,
    distinguishing_features TEXT,
    is_found BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. Vehicles details (Sub-type details linked to report)
CREATE TABLE vehicles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    report_id BIGINT NOT NULL UNIQUE,
    license_plate VARCHAR(30) NOT NULL,
    make_model VARCHAR(100) NOT NULL,
    color VARCHAR(30),
    registration_year INT,
    stolen_date DATE NOT NULL,
    is_recovered BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. Complaints (Misconduct reports submitted by citizens)
CREATE TABLE complaints (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    citizen_id BIGINT NOT NULL,
    accused_officer_id BIGINT,
    officer_name_or_badge VARCHAR(150), -- text details if exact ID is unknown
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('SUBMITTED', 'UNDER_INVESTIGATION', 'RESOLVED', 'REJECTED') DEFAULT 'SUBMITTED',
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (citizen_id) REFERENCES citizens(id) ON DELETE CASCADE,
    FOREIGN KEY (accused_officer_id) REFERENCES police_officers(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14. Notifications (Sent to citizens/officers)
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipient_user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipient_user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 15. Audit Logs (Compliance tracking)
CREATE TABLE audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    performed_by_user_id BIGINT,
    action_performed VARCHAR(100) NOT NULL, -- e.g. 'LOGIN', 'CREATE_CASE', 'VIEW_EVIDENCE'
    ip_address VARCHAR(45) NOT NULL,
    details TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (performed_by_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- SEED DATA
-- 1. Districts
INSERT INTO districts (id, name, code) VALUES
(1, 'Central District', 'CD-01'),
(2, 'North Metropolitan', 'NM-02'),
(3, 'East Valley', 'EV-03'),
(4, 'South Coastal', 'SC-04'),
(5, 'West Highlands', 'WH-05');

-- 2. Police Stations
INSERT INTO police_stations (id, name, code, district_id, address, phone_number, latitude, longitude) VALUES
(1, 'Central Precinct HQ', 'PS-HQ-001', 1, '452 Government Blvd, Capitol City', '+1 (555) 019-2001', 37.774929, -122.419416),
(2, 'Metro North Precinct', 'PS-MN-002', 2, '108 Industrial Way, Sector 4', '+1 (555) 019-2002', 37.789421, -122.401241),
(3, 'Valley Station', 'PS-VS-003', 3, '89 Oakridge Ave, Valley Springs', '+1 (555) 019-2003', 37.756282, -122.449190),
(4, 'Coastal Watch Unit', 'PS-CW-004', 4, '14 Ocean Promenade, Beachside', '+1 (555) 019-2004', 37.731211, -122.502911);

-- 3. Predefined Users (Admin, Officer, Citizen)
-- Passwords are secure bcrypt hashes of 'GovFind@2026'
INSERT INTO users (id, username, email, password_hash, role, is_active) VALUES
(1, 'admin_clara', 'admin.clara@govfind.gov', '$2a$12$N9qo8uLOqpY3A9TdfKkGeO/Xitg/rIeP6fF2/XqfQW0P7/ZveH/lK', 'ADMIN', 1),
(2, 'officer_john', 'john.miller@police.gov', '$2a$12$N9qo8uLOqpY3A9TdfKkGeO/Xitg/rIeP6fF2/XqfQW0P7/ZveH/lK', 'POLICE', 1),
(3, 'officer_sarah', 'sarah.chen@police.gov', '$2a$12$N9qo8uLOqpY3A9TdfKkGeO/Xitg/rIeP6fF2/XqfQW0P7/ZveH/lK', 'POLICE', 1),
(4, 'citizen_robert', 'robert.davis@email.com', '$2a$12$N9qo8uLOqpY3A9TdfKkGeO/Xitg/rIeP6fF2/XqfQW0P7/ZveH/lK', 'CITIZEN', 1);

-- 4. Citizen Profile
INSERT INTO citizens (id, user_id, first_name, last_name, national_id, phone_number, address) VALUES
(1, 4, 'Robert', 'Davis', 'NID-9481948', '+1 (555) 012-3456', '789 Pine Ave, Apt 4B, Capitol City');

-- 5. Police Officer Profiles
INSERT INTO police_officers (id, user_id, badge_number, first_name, last_name, rank_title, station_id) VALUES
(1, 2, 'BADGE-7402', 'John', 'Miller', 'Senior Investigator', 1),
(2, 3, 'BADGE-3819', 'Sarah', 'Chen', 'Detective Sergeant', 2);

-- 6. Admin Profile
INSERT INTO admins (id, user_id, full_name) VALUES
(1, 1, 'Clara Oswald');
