MySql Queries for CareerPilot

CREATE DATABASE test;
GRANT ALL PRIVILEGES ON test.* TO 'root'@'localhost';
FLUSH PRIVILEGES;

CREATE TABLE `golang_stud` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone_number` VARCHAR(255),
    `role` VARCHAR(100) NOT NULL,
    INDEX `idx_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `available_jobs` (
    `job_id` INT AUTO_INCREMENT PRIMARY KEY,
    `job_title` VARCHAR(255) NOT NULL,
    `job_description` TEXT NOT NULL,
    `experience_required` VARCHAR(255) NOT NULL,
    `company_name` VARCHAR(255) NOT NULL,
    `location` VARCHAR(255) NOT NULL,
    `bond_years` VARCHAR(50) NOT NULL,
    `posted_by` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO available_jobs (
    job_title,
    job_description,
    experience_required,
    company_name,
    location,
    bond_years,
    posted_by
) VALUES (
    'Software Developer',
    'Responsible for developing enterprise-level solutions.',
    '5 years',
    'Tech Innovations Inc.',
    'New York',
    '2 years',
    'admin'
);

CREATE TABLE `applied_jobs1` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255) NOT NULL,
    `job_title` VARCHAR(255) NOT NULL,
    `company_name` VARCHAR(255) NOT NULL,
    `resume` TEXT NOT NULL,
    `posted_by` VARCHAR(255) NOT NULL,
    INDEX `idx_username` (`username`),
    INDEX `idx_job_title` (`job_title`),
    INDEX `idx_company_name` (`company_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO applied_jobs1 (
    username,
    job_title,
    company_name,
    resume,
    posted_by
) VALUES (
    'john_doe',
    'Software Engineer',
    'Tech Innovations Inc.',
    'John Doe''s resume content...',
    'admin'
);



