-- 1st Situation: Law Firm
DROP TABLE IF EXISTS LF_Employees;
CREATE TABLE LF_Employees (
    EmployeeID SERIAL PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Position VARCHAR(50),
    OfficeNumber VARCHAR(10)
);

DROP TABLE IF EXISTS LF_Offices;
CREATE TABLE LF_Offices (
    OfficeNumber VARCHAR(10) PRIMARY KEY,
    Building VARCHAR(50),
    Floor INT,
    Size VARCHAR(20)
);


-- 2nd Situation: Customs
DROP TABLE IF EXISTS CU_EntryRecords CASCADE;
DROP TABLE IF EXISTS CU_Tourists CASCADE;
CREATE TABLE CU_Tourists (
    TouristID SERIAL PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Nationality VARCHAR(50),
    BirthDate DATE
);

CREATE TABLE CU_EntryRecords (
    RecordID SERIAL PRIMARY KEY,
    TouristID INT REFERENCES CU_Tourists(TouristID),
    PassportNumber VARCHAR(20),
    ArrivalDate DATE,
    VisaType VARCHAR(50)
);


-- 3rd Situation: Airline
DROP TABLE IF EXISTS AL_Customers;
CREATE TABLE AL_Customers (
    CustomerID SERIAL PRIMARY KEY,
    Name VARCHAR(50),
    Email VARCHAR(50),
    Phone VARCHAR(15)
);

DROP TABLE IF EXISTS AL_Flights;
CREATE TABLE AL_Flights (
    FlightNumber VARCHAR(10) PRIMARY KEY,
    DepartureTime TIMESTAMP,
    ArrivalTime TIMESTAMP,
    Origin VARCHAR(50),
    Destination VARCHAR(50)
);

DROP TABLE IF EXISTS AL_Bookings;
CREATE TABLE AL_Bookings (
    BookingID SERIAL PRIMARY KEY,
    CustomerID INT REFERENCES AL_Customers(CustomerID),
    FlightNumber VARCHAR(10) REFERENCES AL_Flights(FlightNumber),
    SeatNumber VARCHAR(5),
    BookingDate TIMESTAMP
);


-- 4th Situation: Bank
DROP TABLE IF EXISTS BK_Customers;
CREATE TABLE BK_Customers (
    CustomerID SERIAL PRIMARY KEY,
    CustomerName VARCHAR(50),
    Email VARCHAR(50),
    Phone VARCHAR(15)
);

DROP TABLE IF EXISTS BK_Accounts;
CREATE TABLE BK_Accounts (
    AccountNumber VARCHAR(20) PRIMARY KEY,
    CustomerID INT REFERENCES BK_Customers(CustomerID),
    Balance DECIMAL(10, 2)
);


-- 5th Situation: Car Dealer
DROP TABLE IF EXISTS CD_Cars;
CREATE TABLE CD_Cars (
    CarID SERIAL PRIMARY KEY,
    Model VARCHAR(50),
    Manufacturer VARCHAR(50),
    Price DECIMAL(10, 2)
);

DROP TABLE IF EXISTS CD_Customers;
CREATE TABLE CD_Customers (
    CustomerID SERIAL PRIMARY KEY,
    CustomerName VARCHAR(50),
    Email VARCHAR(50),
    Phone VARCHAR(15)
);

DROP TABLE IF EXISTS CD_Orders;
CREATE TABLE CD_Orders (
    OrderID SERIAL PRIMARY KEY,
    CustomerID INT REFERENCES CD_Customers(CustomerID),
    CarID INT REFERENCES CD_Cars(CarID),
    OrderDate TIMESTAMP
);


-- 6th Situation: Film Archive
DROP TABLE IF EXISTS FA_Movies;
CREATE TABLE FA_Movies (
    MovieID SERIAL PRIMARY KEY,
    Title VARCHAR(100),
    ReleaseYear INT
);

DROP TABLE IF EXISTS FA_Actors;
CREATE TABLE FA_Actors (
    ActorID SERIAL PRIMARY KEY,
    ActorName VARCHAR(50)
);

DROP TABLE IF EXISTS FA_Casts;
CREATE TABLE FA_Casts (
    MovieID INT REFERENCES FA_Movies(MovieID),
    ActorID INT REFERENCES FA_Actors(ActorID),
    ActorRole VARCHAR(50),
    PRIMARY KEY (MovieID, ActorID)
);


-- 7th Situation: Hospital
DROP TABLE IF EXISTS HP_Patients;
CREATE TABLE HP_Patients (
    PatientID SERIAL PRIMARY KEY,
    PatientsName VARCHAR(50),
    BirthDate DATE
);

DROP TABLE IF EXISTS HP_Doctors;
CREATE TABLE HP_Doctors (
    DoctorID SERIAL PRIMARY KEY,
    DoctorName VARCHAR(50),
    Specialty VARCHAR(50)
);

DROP TABLE IF EXISTS HP_Appointments;
CREATE TABLE HP_Appointments (
    AppointmentID SERIAL PRIMARY KEY,
    PatientID INT REFERENCES HP_Patients(PatientID),
    DoctorID INT REFERENCES HP_Doctors(DoctorID),
    AppointmentDate TIMESTAMP
);


-- 8th Situation: Company
DROP TABLE IF EXISTS CP_Departments;
CREATE TABLE CP_Departments (
    DepartmentID SERIAL PRIMARY KEY,
    DepartmentName VARCHAR(50)
);

DROP TABLE IF EXISTS CP_Employees;
CREATE TABLE CP_Employees (
    EmployeeID SERIAL PRIMARY KEY,
    EmployeeName VARCHAR(50),
    DepartmentID INT REFERENCES CP_Departments(DepartmentID),
    Phone VARCHAR(15)
);


-- 9th Situation: Supermarket
DROP TABLE IF EXISTS SM_Products;
CREATE TABLE SM_Products (
    ProductID SERIAL PRIMARY KEY,
    ProductName VARCHAR(50),
    Price DECIMAL(10, 2)
);

DROP TABLE IF EXISTS SM_Receipts;
CREATE TABLE SM_Receipts (
    ReceiptID SERIAL PRIMARY KEY,
    ReceiptDate TIMESTAMP
);

DROP TABLE IF EXISTS SM_ReceiptItems;
CREATE TABLE SM_ReceiptItems (
    ReceiptID INT REFERENCES SM_Receipts(ReceiptID),
    ProductID INT REFERENCES SM_Products(ProductID),
    Quantity INT,
    PRIMARY KEY (ReceiptID, ProductID)
);


-- 10th Situation: Online Store
DROP TABLE IF EXISTS OS_Customers;
CREATE TABLE OS_Customers (
    CustomerID SERIAL PRIMARY KEY,
    CustomerName VARCHAR(50),
    Email VARCHAR(50)
);

DROP TABLE IF EXISTS OS_Products;
CREATE TABLE OS_Products (
    ProductID SERIAL PRIMARY KEY,
    Name VARCHAR(50),
    Price DECIMAL(10, 2)
);

DROP TABLE IF EXISTS OS_Reviews;
CREATE TABLE OS_Reviews (
    ReviewID SERIAL PRIMARY KEY,
    CustomerID INT REFERENCES OS_Customers(CustomerID),
    ProductID INT REFERENCES OS_Products(ProductID),
    Rating INT,
    Comment TEXT
);


-- 11th Situation: Bookstore
DROP TABLE IF EXISTS BS_Books;
CREATE TABLE BS_Books (
    BookID SERIAL PRIMARY KEY,
    Title VARCHAR(100),
    Author VARCHAR(50)
);


-- 12th Situation: Restaurant
DROP TABLE IF EXISTS RS_Tables;
CREATE TABLE RS_Tables (
    TableID SERIAL PRIMARY KEY,
    Capacity INT
);

DROP TABLE IF EXISTS RS_Menus;
CREATE TABLE RS_Menus (
    MenuID SERIAL PRIMARY KEY,
    MenuName VARCHAR(50),
    Price DECIMAL(10, 2)
);

DROP TABLE IF EXISTS RS_Orders;
CREATE TABLE RS_Orders (
    OrderID SERIAL PRIMARY KEY,
    TableID INT REFERENCES RS_Tables(TableID),
    MenuID INT REFERENCES RS_Menus(MenuID),
    OrderDate TIMESTAMP
);

INSERT INTO LF_Employees (FirstName, LastName, Position, OfficeNumber)
VALUES ('John', 'Doe', 'Lawyer', '101');

SELECT * FROM LF_Employees;