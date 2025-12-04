-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS todo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE todo_db;

-- Create user if it doesn't exist
CREATE USER IF NOT EXISTS 'todo_user'@'%' IDENTIFIED BY 'todo_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON todo_db.* TO 'todo_user'@'%';

-- Flush privileges
FLUSH PRIVILEGES;