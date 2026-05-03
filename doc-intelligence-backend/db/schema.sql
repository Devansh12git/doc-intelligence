CREATE DATABASE IF NOT EXISTS `doc_intelligence`;
USE `doc_intelligence`;

CREATE TABLE IF NOT EXISTS `documents` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `file_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(512) NOT NULL,
  `full_text` LONGTEXT,
  `vendor` VARCHAR(255),
  `invoice_number` VARCHAR(128),
  `invoice_date` VARCHAR(64),
  `amount` DECIMAL(15,2),
  `processed` TINYINT(1) DEFAULT 0,
  `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `document_extracts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `document_id` INT NOT NULL,
  `data` JSON,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON DELETE CASCADE
);
