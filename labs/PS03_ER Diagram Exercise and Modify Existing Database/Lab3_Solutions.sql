-- CPE241 Lab 03: ER Diagram Exercise and Modify Existing Database
-- This lab focuses on Schema Evolution using ALTER TABLE

-- 1. Adding New Columns (Task 2.1)
-- Add an Email column to Law Firm Employees
ALTER TABLE LF_Employees ADD COLUMN Email VARCHAR(100);

-- Add a ContactPerson column to Law Firm Offices
ALTER TABLE LF_Offices ADD COLUMN ContactPerson VARCHAR(50);


-- 2. Modifying Data Types (Task 2.2)
-- Increase the length of FirstName and LastName in CU_Tourists
ALTER TABLE CU_Tourists ALTER COLUMN FirstName TYPE VARCHAR(100);
ALTER TABLE CU_Tourists ALTER COLUMN LastName TYPE VARCHAR(100);


-- 3. Renaming and Dropping Columns (Task 2.3)
-- Rename 'Position' to 'JobTitle' in LF_Employees
ALTER TABLE LF_Employees RENAME COLUMN Position TO JobTitle;

-- Drop 'Size' from LF_Offices (suppose we use SquareFootage instead)
ALTER TABLE LF_Offices DROP COLUMN Size;
ALTER TABLE LF_Offices ADD COLUMN SquareFootage INT;


-- 4. Adding Constraints (Task 2.4)
-- Add a NOT NULL constraint to CustomerName in BK_Customers
-- Note: Ensure there are no nulls before running this on a live DB
ALTER TABLE BK_Customers ALTER COLUMN CustomerName SET NOT NULL;

-- Add a UNIQUE constraint to Email in BK_Customers
ALTER TABLE BK_Customers ADD CONSTRAINT unique_email UNIQUE (Email);

-- Add a CHECK constraint to ensure Balance is never negative
ALTER TABLE BK_Accounts ADD CONSTRAINT check_balance_non_negative CHECK (Balance >= 0);


-- 5. Default Values
-- Set a default value for 'Building' in LF_Offices
ALTER TABLE LF_Offices ALTER COLUMN Building SET DEFAULT 'Main Tower';


-- 6. Verification
-- Show the structure of modified tables (using table info or just SELECT)
-- In PostgreSQL, you would use \d table_name in psql
SELECT * FROM LF_Employees LIMIT 0;
SELECT * FROM LF_Offices LIMIT 0;
SELECT * FROM BK_Customers LIMIT 0;
SELECT * FROM BK_Accounts LIMIT 0;
