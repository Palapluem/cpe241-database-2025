# CPE241 Database Systems (1/2025)

This repository contains materials for the **CPE241 Database Systems** course, semester 1/2025. It includes lab exercises, SQL scripts, and database design drafts.

## 📂 Project Structure

- **[labs/](labs/)**
    - **[PS01_Getting started/](labs/PS01_Getting%20started/)**: Draft designs and initial table creations for 12 scenarios.
        - [Lab1_Draft_Designs.md](labs/PS01_Getting%20started/Lab1_Draft_Designs.md): Data requirements draft.
        - [Lab1_IDR.sql](labs/PS01_Getting%20started/Lab1_IDR.sql): Initial Database schema (DDL).
    - **[PS02_Simple Database Management/](labs/PS02_Simple%20Database%20Management/)**: Data manipulation and basic querying.
        - [Lab2_Solutions.sql](labs/PS02_Simple%20Database%20Management/Lab2_Solutions.sql): Data insertion (DML) and SQL queries.
    - **[PS03_ER Diagram Exercise and Modify Existing Database/](labs/PS03_ER%20Diagram%20Exercise%20and%20Modify%20Existing%20Database/)**: Schema evolution and constraints.
        - [Lab3_Solutions.sql](labs/PS03_ER%20Diagram%20Exercise%20and%20Modify%20Existing%20Database/Lab3_Solutions.sql): Schema modification (ALTER TABLE).
- **[lectures/](lectures/)**: Course lecture notes and slides.

## 🚀 Getting Started

The SQL scripts are designed for **PostgreSQL**. To set up the database:
1. Run `Lab1_IDR.sql` to create the tables.
2. Run `Lab2_Solutions.sql` to populate data and test queries.
3. Run `Lab3_Solutions.sql` to apply structural changes and constraints.

## 📝 Lab Summaries

### Lab 01: Identify Data Requirements
Defining entities and relationships for various scenarios including Law Firm, Bank, Supermarket, etc.

### Lab 02: Simple Database Management
Focuses on `INSERT`, `SELECT` (Joins, Aggregations), `UPDATE`, and `DELETE` operations.

### Lab 03: Schema Evolution
Practicing `ALTER TABLE` to add/modify columns and implement integrity constraints like `UNIQUE`, `NOT NULL`, and `CHECK`.
