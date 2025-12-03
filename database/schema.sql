-- CTechLit Tech Consultancy Database Schema
-- MySQL Database Setup Script

-- Create database
CREATE DATABASE IF NOT EXISTS ctechlit_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ctechlit_db;

-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(100),
    role ENUM('client', 'admin') NOT NULL DEFAULT 'client',
    status ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
    failed_login_attempts INT DEFAULT 0,
    last_login_attempt TIMESTAMP NULL,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Services Table
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    duration VARCHAR(100) NOT NULL, -- e.g., "2-4 weeks", "1 month"
    category VARCHAR(100) NOT NULL,
    features JSON, -- Array of features
    requirements JSON, -- Array of requirements
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Service Requests Table
CREATE TABLE service_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    service_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    budget DECIMAL(10, 2),
    timeline VARCHAR(100),
    requirements TEXT,
    status ENUM('pending', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    admin_notes TEXT,
    estimated_completion DATE,
    actual_completion DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT,
    INDEX idx_user_id (user_id),
    INDEX idx_service_id (service_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Notifications Table
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL, -- NULL for system-wide notifications
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'success', 'warning', 'error') NOT NULL DEFAULT 'info',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    link VARCHAR(500), -- Optional link to related content
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
);

-- Site Content Table
CREATE TABLE site_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page VARCHAR(100) NOT NULL, -- e.g., 'home', 'about', 'services'
    section VARCHAR(100) NOT NULL, -- e.g., 'hero', 'footer', 'features'
    content_type ENUM('text', 'html', 'json', 'media') NOT NULL DEFAULT 'text',
    content TEXT NOT NULL,
    metadata JSON, -- Additional metadata for the content
    -- Media-specific columns for better organization and performance
    media_path VARCHAR(500), -- Direct path to uploaded media file
    media_type ENUM('image', 'video', 'audio', 'document', 'other') NULL,
    file_size INT NULL, -- Size in bytes
    mime_type VARCHAR(100) NULL, -- MIME type of the file
    alt_text VARCHAR(255) NULL, -- Alt text for accessibility
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_page_section (page, section),
    INDEX idx_page (page),
    INDEX idx_section (section),
    INDEX idx_is_active (is_active),
    INDEX idx_media_type (media_type),
    INDEX idx_file_size (file_size)
);

-- File Uploads Table
CREATE TABLE file_uploads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL, -- Size in bytes
    mime_type VARCHAR(100) NOT NULL,
    file_type ENUM('document', 'image', 'video', 'other') NOT NULL,
    entity_type VARCHAR(50), -- e.g., 'service_request', 'profile'
    entity_id INT, -- ID of related entity
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created_at (created_at)
);

-- Audit Log Table
CREATE TABLE audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL, -- e.g., 'login', 'create_request', 'update_profile'
    entity_type VARCHAR(50), -- e.g., 'user', 'service_request', 'service'
    entity_id INT,
    old_values JSON, -- Previous values (for updates)
    new_values JSON, -- New values
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created_at (created_at)
);

-- Sessions Table (for JWT blacklist if needed)
CREATE TABLE user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    token_type ENUM('access', 'refresh') NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    revoked_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_token_hash (token_hash),
    INDEX idx_expires_at (expires_at)
);

-- Create views for common queries
CREATE VIEW user_requests_view AS
SELECT 
    sr.*,
    s.name as service_name,
    s.category as service_category,
    u.first_name,
    u.last_name,
    u.email,
    u.company
FROM service_requests sr
JOIN services s ON sr.service_id = s.id
JOIN users u ON sr.user_id = u.id;

-- Create triggers for audit logging
DELIMITER //

CREATE TRIGGER users_audit_update
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (
        user_id, action, entity_type, entity_id, old_values, new_values
    ) VALUES (
        NEW.id, 'update', 'user', NEW.id,
        JSON_OBJECT(
            'email', OLD.email,
            'first_name', OLD.first_name,
            'last_name', OLD.last_name,
            'phone', OLD.phone,
            'company', OLD.company,
            'status', OLD.status
        ),
        JSON_OBJECT(
            'email', NEW.email,
            'first_name', NEW.first_name,
            'last_name', NEW.last_name,
            'phone', NEW.phone,
            'company', NEW.company,
            'status', NEW.status
        )
    );
END;//

CREATE TRIGGER service_requests_audit_insert
AFTER INSERT ON service_requests
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (
        user_id, action, entity_type, entity_id, new_values
    ) VALUES (
        NEW.user_id, 'create', 'service_request', NEW.id,
        JSON_OBJECT(
            'title', NEW.title,
            'description', NEW.description,
            'service_id', NEW.service_id,
            'status', NEW.status
        )
    );
END;//

DELIMITER ;