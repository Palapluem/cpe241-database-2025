-- Lab 10: Transactions, Users, Privileges, Views, Indexing, and Query Analysis (PostgreSQL Version)

-- ==========================================
-- STEP 1: Setup - Create Database and Table
-- ==========================================

-- 1. Create the database (Run this block separately first, then connect to the database)
-- CREATE DATABASE company_db;

-- 2. Create the table
-- Note: In PostgreSQL, we use SERIAL for auto-incrementing integers.
CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    position VARCHAR(50),
    department VARCHAR(50),
    salary DECIMAL(10,2),
    hire_date DATE
);

-- Check if table exists
-- \d employee 
-- SELECT * FROM employee;

-- ==========================================
-- STEP 2: Transactions
-- ==========================================

-- 2.1 Demonstrate ROLLBACK (Data should NOT be saved)
BEGIN; -- Start Transaction in PostgreSQL

INSERT INTO employee (name, position, department, salary, hire_date)
VALUES ('Alice', 'Manager', 'HR', 95000, '2020-01-15');

INSERT INTO employee (name, position, department, salary, hire_date)
VALUES ('Bob', 'Engineer', 'IT', 105000, '2021-03-01');

SELECT * FROM employee; -- Verify data is visible within transaction

ROLLBACK; -- Undo changes

SELECT * FROM employee; -- Verify data is gone

-- 2.2 Demonstrate COMMIT (Data SHOULD be saved)
BEGIN;

INSERT INTO employee (name, position, department, salary, hire_date)
VALUES ('Bob', 'Engineer', 'IT', 98000, '2021-03-01');

COMMIT; -- Save changes

SELECT * FROM employee; -- Verify data persists

-- ==========================================
-- STEP 3: User and Privileges
-- ==========================================

-- 3.1 Create a new user
-- Note: PostgreSQL users are global across the cluster, usually created without @host
-- If the user already exists, drop it first: DROP USER IF EXISTS hr_user;
CREATE USER hr_user WITH PASSWORD 'hrpass123';

-- 3.2 Grant permissions
-- Grant usage on schema public (often needed if not default)
GRANT USAGE ON SCHEMA public TO hr_user;
-- Grant SELECT and INSERT on the specific table
GRANT SELECT, INSERT ON TABLE employee TO hr_user;
-- Important for SERIAL/ID auto-increment: Grant usage on the sequence
GRANT USAGE, SELECT ON SEQUENCE employee_id_seq TO hr_user;

-- Note: FLUSH PRIVILEGES is not needed in PostgreSQL.

-- Testing permissions (You would typically open a new connection for this):
-- \c company_db hr_user

-- 1. ทดสอบการดูข้อมูล (ควรทำได้)
SELECT * FROM employee;

-- 2. ทดสอบการเพิ่มข้อมูลใหม่ (ควรทำได้)
-- เปลี่ยนชุดข้อมูลเป็น 'Antony', 'ML', 'Engineering'
INSERT INTO employee (name, position, department, salary, hire_date)
VALUES ('Antony', 'ML', 'Engineering', 67670, '2026-01-20');

-- 3. ตรวจสอบข้อมูลหลังเพิ่ม
SELECT * FROM employee;

-- 4. ทดสอบสิทธิ์ที่ไม่ได้ให้ (ควรจะ Error: Permission Denied)
-- ลองลบข้อมูล (เราไม่ได้ GRANT DELETE ให้)
DELETE FROM employee WHERE name = 'Antony';

-- ลองแก้ไขข้อมูล (เราไม่ได้ GRANT UPDATE ให้)
UPDATE employee SET salary = 70000 WHERE name = 'Antony';

-- ==========================================
-- STEP 4: Create View
-- ==========================================

-- 4.1 Create a view to hide salary and hire_date
CREATE VIEW employee_public AS
SELECT id, name, position, department 
FROM employee;

-- 4.2 Grant access to the view and restrict table access
GRANT SELECT ON employee_public TO hr_user;
REVOKE SELECT ON employee FROM hr_user;

-- Testing view access (Connect as hr_user first: \c company_db hr_user):
-- 1. ดูผ่าน View (ควรทำได้ และไม่เห็นเงินเดือน)
-- SELECT * FROM employee_public;

-- 2. ดูผ่านตารางโดยตรง (ควรจะ Error: Permission Denied เพราะโดน REVOKE แล้ว)
-- SELECT * FROM employee;

-- ==========================================
-- STEP 5: Add Indexes
-- ==========================================

-- 5.1 Simple Index
CREATE INDEX idx_department ON employee(department);

-- 5.2 Composite Index
-- Note: 'position' is a reserved keyword in some contexts, but valid as column name here.
CREATE INDEX idx_pos_date ON employee(position, hire_date);

-- Verify indexes
-- \d employee

-- ==========================================
-- STEP 6: Analyze Queries
-- ==========================================

-- 6.1 Explain Plan (Show execution plan without running)
EXPLAIN SELECT * FROM employee WHERE department = 'IT';

-- 6.2 Explain Analyze (Run query and show actual execution times)
-- Note: PostgreSQL uses EXPLAIN ANALYZE, different from MySQL's syntax.
EXPLAIN ANALYZE SELECT * FROM employee WHERE department = 'IT';
