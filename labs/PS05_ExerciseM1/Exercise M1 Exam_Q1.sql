-- ============================================================
-- Step 4: Write SQL statements to create tables (DDL)
-- ============================================================

-- create database for (Q1) students, courses, departments, registration, and grades
CREATE DATABASE school_db;
USE school_db;

-- 1. create Departments
CREATE TABLE departments (
    dept_id INT AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(100) NOT NULL UNIQUE
);

-- 2. create Students
CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    dept_id INT,
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);

-- 3. create Courses
CREATE TABLE courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    credits INT DEFAULT 3,
    dept_id INT,
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);

-- 4. create Registration
CREATE TABLE registration (
    reg_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    semester VARCHAR(10) NOT NULL,
    reg_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    
    UNIQUE (student_id, course_id, semester)
);

-- 5. create Grades
CREATE TABLE grades (
    grade_id INT AUTO_INCREMENT PRIMARY KEY,
    reg_id INT NOT NULL UNIQUE,
    grade_value CHAR(2) NOT NULL,
    
    FOREIGN KEY (reg_id) REFERENCES registration(reg_id) ON DELETE CASCADE,
    
    CHECK (grade_value IN ('A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F', 'W'))
);

-- ============================================================
-- Step 5: Generate examples data and insert them (DML)
-- ============================================================

-- 1. Insert Departments
INSERT INTO departments (dept_name) VALUES 
('Computer Engineering'),
('Electrical Engineering'),
('Mechanical Engineering'),
('Digital Media');

-- 2. Insert Students
INSERT INTO students (first_name, last_name, email, dept_id) VALUES 
('Somsak', 'Jaidee', 'somsak@example.com', 1),
('Somchai', 'Rakrian', 'somchai@example.com', 1),
('Wipa', 'Siri', 'wipa@example.com', 2),
('Mana', 'Kla', 'mana@example.com', 3),
('Suda', 'Yodrak', 'suda@example.com', 4);

-- 3. Insert Courses
INSERT INTO courses (course_name, credits, dept_id) VALUES 
('Database Systems', 3, 1),
('Data Structures', 3, 1),
('Circuit Analysis', 4, 2),
('Thermodynamics', 3, 3),
('Graphic Design', 3, 4);

-- 4. Insert Registration
INSERT INTO registration (student_id, course_id, semester) VALUES 
(1, 1, '1/2025'),
(1, 2, '1/2025'),
(2, 1, '1/2025'),
(3, 3, '1/2025'),
(4, 4, '1/2025'),
(5, 5, '1/2025');

-- 5. Insert Grades
INSERT INTO grades (reg_id, grade_value) VALUES 
(1, 'A'),
(2, 'B+'),
(3, 'C+'),
(4, 'B'),
(5, 'D+'),
(6, 'A');