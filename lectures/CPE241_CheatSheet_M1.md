# CPE241 Module 1: Ultimate Cheat Sheet (Mock Exam Reference)

## Part 1: Core Concepts (Expanded & Related)

### 1. Database Pioneers & Models
*   **Dr. Edgar F. Codd (E.F. Codd):** The "Father" of the Relational Model (1970). Proposed the 12 rules for RDBMS.
*   **Peter Chen:** The creator of the Entity-Relationship (ER) Model (1976).

### 2. Characteristics of Relations (Tables)
*   **Rows (Tuples):**
    *   **Uniqueness:** No duplicate rows allowed (Key concept).
    *   **Order:** Row order is **insignificant**.
*   **Columns (Attributes):**
    *   **Atomic:** Cells must have single values (1NF).
    *   **Homogenous:** All values in a column must be same type.
    *   **Order:** Column order is **insignificant**.

### 3. Attribute Classifications & Notation
*   **Simple:** Atomic, cannot be split (e.g., Blood Type). *Solid Ellipse*.
*   **Composite:** Can be split into sub-attributes (e.g., Name $\rightarrow$ First, Last; Address $\rightarrow$ Street, City).
*   **Multi-valued:** Has multiple values for one entity (e.g., Phone numbers, Skills). *Double Ellipse*. (*Mapping Consideration: Requires new table in DB*).
*   **Derived:** Calculated from others (e.g., Age from Birthdate). *Dashed Ellipse*.
*   **Stored:** Attributes physically saved in the DB (e.g., Birthdate).

### 4. Keys & Identification
*   **Super Key:** Any set of attributes that uniquely identifies a row.
*   **Candidate Key:** A **minimal** Super Key (no redundant attributes).
*   **Primary Key (PK):** The chosen candidate key. Not NULL.
*   **Composite Key:** A key composed of 2+ attributes.
*   **Alternate Key:** Candidate keys not chosen as PK.
*   **Foreign Key (FK):** Links to a PK in another table.

### 5. ER Notation & Weak Entities (Chen Model)
*   **Strong Entity:** Rectangle. Independent existence.
*   **Weak Entity:** Double Rectangle. Dependent existence.
    *   *Identification:* Identified by its **Partial Key** + Owner's **PK**.
*   **Identifying Relationship:** Double Diamond. Connects Weak to Owner.
*   **Total Participation:** Double Line. Entity *must* participate in relationship (min=1).
*   **Partial Participation:** Single Line. Entity *may* participate (min=0).

### 6. Mapping Relationships to Tables (Logical Design)
*   **1:1 (One-to-One):**
    *   *Best Practice:* Collapse into 1 table if Total Participation on both sides.
    *   *Alternative:* Add FK to one side (prefer Total side).
*   **1:N (One-to-Many):**
    *   *Rule:* FK goes to **"Many"** side. (Child points to Parent).
*   **M:N (Many-to-Many):**
    *   *Rule:* Must create a **New Junction Table** (Associative Entity).
    *   *Key:* Composite PK (FK\_A + FK\_B).
*   **Recursive Relationship:**
    *   *1:N Recursive:* Add FK to same table (e.g., `Employee` points to `Employee` for manager).
    *   *M:N Recursive:* Create new junction table with 2 FKs pointing to same source table.

### 7. Integrity Constraints
*   **Entity Integrity:** PK cannot be `NULL` + Must be Unique.
*   **Referential Integrity:** FK must match Parent PK or be `NULL`.
*   **Domain Constraint:** Values must match defined type (e.g., integer, date) or logic (e.g., GPA 0.0-4.0).

### 8. Enhanced ER (EER) Constraints
*   **Disjoint (d):** Entity must be **only one** subclass (e.g., Male OR Female).
*   **Overlapping (o):** Entity can be **multiple** subclasses (e.g., Student AND Employee).
*   **Union (u):** Subclass has multiple *different* superclasses.

### 9. SQL Command Categories
*   **DDL (Definition - Structure):** `CREATE`, `ALTER`, `DROP` (Remove table+data completely), `TRUNCATE` (Remove data/Keep structure/Reset ID).
*   **DML (Manipulation - Data):** `INSERT`, `UPDATE`, `DELETE`, `SELECT`.
*   **DCL (Control - Access):** `GRANT`, `REVOKE`.

### 10. Data Modification Rules
*   **DELETE requires WHERE:** Without `WHERE`, it deletes all rows (dangerous like `TRUNCATE` but slower).
*   **UPDATE requires WHERE:** Without `WHERE`, it updates all rows.

---

## Part 2: Short Answer Concepts (Comprehensive Review)

### 1. Schema Modification Commands
*   **Command:** `ALTER TABLE` is used to change the structure of an existing table.
*   **Common Variations:**
    *   `ADD column_name datatype`: Adds a new column.
    *   `MODIFY column_name new_datatype`: Changes data type or constraints.
    *   `DROP COLUMN column_name`: Removes a column.
    *   `RENAME TO new_table_name`: Renames the table.

### 2. Common Relational DBMS (rDBMS)
*   **Definition:** Software that manages relational databases using SQL.
*   **Examples:**
    *   **Open Source:** MySQL, PostgreSQL.
    *   **Commercial:** Oracle Database, Microsoft SQL Server, IBM Db2.
    *   *Note:* Lab environments typically use **MySQL** or **PostgreSQL**.

### 3. Data Manipulation Language (DML) Components
*   **Purpose:** Commands used to manage data *inside* the tables.
*   **Key Commands:**
    1.  **INSERT:** Adds new rows.
    2.  **UPDATE:** Modifies existing data.
    3.  **DELETE:** Removes rows.
    *   *(SELECT is often grouped here as DQL, but distinct).*

### 4. Cardinality Types & Real-World Examples
*   **1:1 (One-to-One):** One instances relates to only one instance (e.g., *Citizen - National ID*).
*   **1:N (One-to-Many):** Parent has many children; Child has one parent.
    *   *Examples:* **Mother - Child** (Biological context), **Doctor - Patient** (Primary care context).
*   **M:N (Many-to-Many):** Both sides can have multiple related instances.
    *   *Examples:* **Student - Course**, **Author - Book**.

### 5. Identifying Weak Relationships
*   **Concept:** A relationship where the child entity cannot exist without the parent.
*   **Detection:** Look for "Part-of" or "Dependence" logic.
    *   *Example:* **House - Room** (Room cannot exist without House).
    *   *Example:* **House - Address** (Address often tied to physical location).
    *   *Symbol:* Double Diamond (Identifying Relationship).

### 6. Composite Key Logic
*   **Definition:** A Primary Key that consists of **two or more attributes** combined.
*   **Usage:**
    *   Required for M:N Junction Tables (FK1 + FK2).
    *   Required for Weak Entities (Owner PK + Partial Key).

### 7. EER Notation: Overlapping vs. Disjoint
*   **Disjoint (d):** Superclass instance can be **only one** specific subclass (e.g., An Account is either Savings OR Checking).
*   **Overlapping (o):** Superclass instance can be **multiple** subclasses simultaneously (e.g., A Person can be an Employee AND a Student).

### 8. Efficient Data Deletion (TRUNCATE)
*   **Scenario:** Need to empty a table fast but keep its structure (columns/constraints) for future use.
*   **Command:** `TRUNCATE TABLE table_name;`
*   **vs DELETE:** `TRUNCATE` is faster (minimal logging) and **resets auto-increment** counters to 1. `DELETE` is slower and keeps the counter.

### 9. Partial Key (Weak Entity ID)
*   **Definition:** An attribute that distinguishes weak entity instances *only within* the context of a specific owner.
*   **Symbol:** Dashed Underline.
*   **Example:** `RoomNumber` in a `Hotel`. (Room 101 exists in many hotels; need HotelID + RoomNumber to be unique).

### 10. Handling Multi-valued Attributes
*   **Problem:** A cell cannot hold multiple values (violates 1NF).
*   **Solution (Mapping):** Create a **separate new table**.
    *   **Structure:**
        1.  Foreign Key (link to original entity).
        2.  The Value itself.
    *   **Primary Key:** Composite of (FK + Value).

---

## Part 3: Simulation Practice (Long Answer Style)

### Practice Problem 1: SQL Design (Table Recreation)
**Problem:**
Write the SQL commands to **create the table** and **insert the 2 rows of data** exactly as shown below.
*   **Constraints:**
    *   `member_id` must be the **Primary Key**.
    *   `username` and `email` must **NOT be NULL**.

| member_id | username | email | points |
| :--- | :--- | :--- | :--- |
| 1001 | gamer_x | x@game.com | 500 |
| 1002 | pro_player | pro@game.com | NULL |

**Guideline Answer:**
```sql
-- 1. Create Table Command
CREATE TABLE Members (
    member_id INT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    points INT
);

-- 2. Insert Data Commands (Watch out for NULLs)
INSERT INTO Members VALUES (1001, 'gamer_x', 'x@game.com', 500);
INSERT INTO Members VALUES (1002, 'pro_player', 'pro@game.com', NULL);
```

### Practice Problem 2: ER Conceptual Design (Focus on Weak Entity)
**Problem Scenario:**
> Design an ER Diagram (Chen Notation) for a **Company Project System**:
> *   A **Department** has a unique Name and Location.
> *   A **Project** has a Title and Budget.
> *   A Department controls many Projects (**1:N**).
> *   Each Project has multiple **Tasks** (Weak Entity).
> *   Tasks are identified by a `TaskNo` (1, 2, 3...) *within* a specific Project. (e.g., Project A has Task 1, Project B has Task 1).

**Diagram Layout Guidelines (Mental Image):**
1.  **Strong Entities:**
    *   `Department` (Rectangle) with attributes Name [PK], Location.
    *   `Project` (Rectangle) with attributes Title [PK], Budget.
2.  **Weak Entity Logic:**
    *   `Task` is the **Weak Entity** $\rightarrow$ **Double Rectangle**.
    *   `TaskNo` is the **Partial Key** $\rightarrow$ **Dashed Underline**.
3.  **Relationships:**
    *   `Controls` (Dept-Proj) $\rightarrow$ Diamond (1:N).
    *   `Has` (Proj-Task) is the **Identifying Relationship** $\rightarrow$ **Double Diamond**.
4.  **Connecting Lines:**
    *   Line from `Task` to `Has` must be a **Double Line** (Total Participation) because a Task cannot exist without a Project.

---

## Part 4: Friend's SQL Cheat Sheet (Complete Code Transcription)

### DDL - Data Definition Language
```sql
CREATE DATABASE db_name;
CREATE TABLE table_name (col1 type, col2 type, ...);
ALTER TABLE t ADD COLUMN col type;
ALTER TABLE t ADD CONSTRAINT name CHECK (cond);
DROP TABLE t;
```

### Constraints Reference
| Constraint | Syntax | TS-style |
| :--- | :--- | :--- |
| **PRIMARY KEY** | `col INT PRIMARY KEY` | `pk: PK<Int>` |
| **COMPOSITE PK** | `PRIMARY KEY (a, b)` | `pk: [a, b]` |
| **FOREIGN KEY** | `col INT REFERENCES t(id)` | `fk: FK<T, RefTable>` |
| **UNIQUE** | `col VARCHAR UNIQUE` | `unique: string` |
| **NOT NULL** | `col VARCHAR NOT NULL` | `required: string` |
| **CHECK** | `CHECK (grade IN ('A','B','C'))` | `check: Grade` |
| **CASCADE** | `ON DELETE CASCADE` | `onDelete: 'CASCADE'` |

### CRUD Summary
| Action | SQL Command | Example |
| :--- | :--- | :--- |
| **Create** | `INSERT INTO` | `INSERT INTO students VALUES (1, 'Alice')` |
| **Read** | `SELECT` | `SELECT * FROM students WHERE id = 1` |
| **Update** | `UPDATE SET` | `UPDATE students SET name='Bob' WHERE id=1` |
| **Delete** | `DELETE FROM` | `DELETE FROM students WHERE id = 1` |

### DML - Data Manipulation Language
```sql
INSERT INTO t (col1, col2) VALUES (val1, val2);
UPDATE t SET col = val WHERE cond;
DELETE FROM t WHERE cond;
```

### DQL - Data Query Language
```sql
SELECT cols FROM t WHERE cond ORDER BY col [ASC|DESC];
SELECT * FROM t1 JOIN t2 ON t1.id = t2.fk_id;
SELECT COUNT(*), AVG(col) FROM t GROUP BY col HAVING cond;
```

### Relationships (Implementation Patterns)
| Pattern | Type | SQL Implementation |
| :--- | :--- | :--- |
| **1:1** | FK + UNIQUE | `student_id INT UNIQUE REFERENCES students(id)` |
| **1:N** | FK on N-side | `dept_id INT REFERENCES departments(id)` |
| **M:N** | Junction Table | `CREATE TABLE ab (a_id INT, b_id INT, PRIMARY KEY(a_id, b_id))` |
| **Unary** | Self-ref FK | `supervisor_id INT REFERENCES employees(id)` |
| **Ternary** | 3-col Junction | `PRIMARY KEY (aid, bid, pid)` |

### Advanced SQL: Recursive & Weak Entities
**Unary (Recursive):**
```sql
CREATE TABLE employee (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  supervisor_id INT NULL REFERENCES employee(id)
);
```

**Weak Entities:**
*Pattern: Owner's PK included in weak entity's composite PK*
```sql
CREATE TABLE orders (order_id INT PRIMARY KEY, order_date DATE);
CREATE TABLE order_items (
  order_id INT NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  item_id INT NOT NULL,
  quantity INT,
  PRIMARY KEY (order_id, item_id)
);
```

### Class-Table Inheritance (Recommended Pattern)
```sql
CREATE TABLE vehicles (id SERIAL PRIMARY KEY, make TEXT, model TEXT);
CREATE TABLE cars (id INT PRIMARY KEY REFERENCES vehicles(id), doors INT);
CREATE TABLE trucks (id INT PRIMARY KEY REFERENCES vehicles(id), payload INT);
```

### Transactions
```sql
BEGIN;
UPDATE accounts SET bal = bal - 100 WHERE id = 1;
UPDATE accounts SET bal = bal + 100 WHERE id = 2;
COMMIT;
```

### Quick Reference: Data Types
| SQL Type | Use For |
| :--- | :--- |
| `INTEGER`, `SERIAL` | IDs, counts |
| `VARCHAR(n)` | Strings |
| `CHAR(n)` | Fixed-length codes |
| `DECIMAL(p,s)` | Money, precise decimals |
| `DATE`, `TIMESTAMP` | Dates, datetimes |
| `BOOLEAN` | True/false |
| `TEXT` | Long strings |

