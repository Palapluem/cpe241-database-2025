-- CPE241 Lab 02: Simple Database Management
-- Using the schemas defined in Lab 1

-- 1. Data Insertion (Task 1)
-- Populating Law Firm (Scenario 1)
INSERT INTO LF_Offices (OfficeNumber, Building, Floor, Size) VALUES
('101', 'Main Tower', 1, 'Small'),
('102', 'Main Tower', 1, 'Medium'),
('201', 'West Wing', 2, 'Large'),
('202', 'West Wing', 2, 'Small'),
('301', 'Executive Suite', 3, 'Medium');

INSERT INTO LF_Employees (FirstName, LastName, Position, OfficeNumber) VALUES
('Somsak', 'Jaidee', 'Junior Lawyer', '101'),
('Wichai', 'Rukthai', 'Senior Lawyer', '201'),
('Mana', 'Manae', 'Partner', '301'),
('Piti', 'Chujai', 'Admin', '102'),
('Manee', 'Deekrab', 'Junior Lawyer', '202');

-- Populating Bank (Scenario 4)
INSERT INTO BK_Customers (CustomerName, Email, Phone) VALUES
('Somchai Khoon', 'somchai@email.com', '081-234-5678'),
('Sompong Rak', 'sompong@email.com', '082-345-6789'),
('Anong Srisuwan', 'anong@email.com', '083-456-7890'),
('Kanda Thong', 'kanda@email.com', '084-567-8901'),
('Veera Boon', 'veera@email.com', '085-678-9012');

INSERT INTO BK_Accounts (AccountNumber, CustomerID, Balance) VALUES
('ACC-001', 1, 15000.50),
('ACC-002', 2, 2500.00),
('ACC-003', 3, 500000.00),
('ACC-004', 4, 1200.75),
('ACC-005', 5, 8900.00);

-- Populating Supermarket (Scenario 9)
INSERT INTO SM_Products (ProductName, Price) VALUES
('Milk', 45.00),
('Bread', 30.00),
('Eggs', 120.00),
('Rice', 180.00),
('Coffee', 150.00);

INSERT INTO SM_Receipts (ReceiptDate) VALUES
('2024-01-20 08:30:00'),
('2024-01-20 09:15:00'),
('2024-01-20 10:45:00'),
('2024-01-21 14:20:00'),
('2024-01-21 16:50:00');

INSERT INTO SM_ReceiptItems (ReceiptID, ProductID, Quantity) VALUES
(1, 1, 2),
(1, 2, 1),
(2, 3, 1),
(3, 1, 1),
(3, 4, 1),
(4, 5, 2),
(5, 2, 3),
(5, 3, 1);


-- 2. SQL Queries (Task 2)
-- Query 1: List all employees along with their building and floor information
SELECT E.FirstName, E.LastName, E.Position, O.Building, O.Floor
FROM LF_Employees E
JOIN LF_Offices O ON E.OfficeNumber = O.OfficeNumber;

-- Query 2: Find customers who have a bank balance greater than 10,000
SELECT C.CustomerName, A.Balance
FROM BK_Customers C
JOIN BK_Accounts A ON C.CustomerID = A.CustomerID
WHERE A.Balance > 10000;

-- Query 3: Calculate the total price of each receipt in the supermarket
SELECT RI.ReceiptID, SUM(P.Price * RI.Quantity) AS TotalAmount
FROM SM_ReceiptItems RI
JOIN SM_Products P ON RI.ProductID = P.ProductID
GROUP BY RI.ReceiptID;

-- Query 4: List all products that have been sold more than 2 times across all receipts
SELECT P.ProductName, SUM(RI.Quantity) AS TotalSold
FROM SM_ReceiptItems RI
JOIN SM_Products P ON RI.ProductID = P.ProductID
GROUP BY P.ProductName
HAVING SUM(RI.Quantity) > 2;

-- Query 5: Find the employee who works in the building 'Executive Suite'
SELECT FirstName, LastName, Position
FROM LF_Employees
WHERE OfficeNumber IN (SELECT OfficeNumber FROM LF_Offices WHERE Building = 'Executive Suite');


-- 3. Data Modification (Task 3)
-- Update an account balance
UPDATE BK_Accounts
SET Balance = Balance + 500
WHERE AccountNumber = 'ACC-002';

-- Delete an employee record
DELETE FROM LF_Employees
WHERE FirstName = 'Manee' AND LastName = 'Deekrab';

-- Display results after modification
SELECT * FROM BK_Accounts WHERE AccountNumber = 'ACC-002';
SELECT * FROM LF_Employees;
