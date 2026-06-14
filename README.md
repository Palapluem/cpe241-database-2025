# CPE241 Database Systems 2025

Course workspace for CPE241 Database Systems, semester 1/2025. It contains lab exercises, SQL scripts, database-design drafts, homework, exam material, lectures, and project work.

## Structure

```text
cpe241-database-2025/
├── exam/       # Exam preparation and review material
├── homework/   # Homework submissions and supporting projects
├── labs/       # Lab exercises and SQL scripts
├── lectures/   # Lecture material
├── project/    # Course project work
└── README.md
```

## Lab Summary

- `labs/PS01_Getting started/` - initial requirements and schema drafting.
- `labs/PS02_Simple Database Management/` - insert, select, update, delete, and basic query practice.
- `labs/PS03_ER Diagram Exercise and Modify Existing Database/` - schema modification, constraints, and ER modeling practice.

## How To Use On Another Machine

1. Clone the repository.
2. Install PostgreSQL or use the database engine required by the specific assignment.
3. Open the SQL script in the target lab folder.
4. Run schema scripts before data manipulation scripts when a lab depends on previous setup.

Recommended order for early labs:

```text
Lab1_IDR.sql
Lab2_Solutions.sql
Lab3_Solutions.sql
```

## Repository Policy

- Track SQL scripts, design notes, diagrams, homework code, and final reports.
- Keep local database dumps, generated caches, and IDE settings out of Git unless they are required deliverables.
- Document any large/private dataset path in the relevant folder README instead of committing it.

## Transfer Status

This repository is ready to clone to a main machine.

Last updated: 2026-06-14
