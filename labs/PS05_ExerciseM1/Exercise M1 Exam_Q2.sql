-- ============================================================
-- Step 4: Write SQL statements to create tables (DDL)
-- ============================================================

-- create database for (Q2) directors, movies, actors, act_ins, and reviews
CREATE DATABASE movie_db;
USE movie_db;

-- 1. Directors
CREATE TABLE directors (
    director_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    birthdate DATE,
    gender CHAR(1)
);

-- 2. Movies (FK -> Directors)
CREATE TABLE movies (
    movie_id INT AUTO_INCREMENT PRIMARY KEY,
    movie_name VARCHAR(100),
    genre VARCHAR(50),
    release_date DATE,
    director_id INT, -- FK
    FOREIGN KEY (director_id) REFERENCES directors(director_id)
);

-- 3. Actors
CREATE TABLE actors (
    actor_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    birthdate DATE,
    gender CHAR(1)
);

-- 4. Act-ins (M:N Link)
CREATE TABLE act_ins (
    actor_id INT, -- FK 1
    movie_id INT, -- FK 2
    role VARCHAR(100),
    -- Composite Primary Key (Optional but good practice)
    PRIMARY KEY (actor_id, movie_id),
    FOREIGN KEY (actor_id) REFERENCES actors(actor_id),
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
);

-- 5. Reviews (FK -> Movies)
CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    score INT,
    comment TEXT,
    movie_id INT, -- FK
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
);

-- ============================================================
-- Step 5: Generate examples data and insert them (DML)
-- ============================================================

-- 1. Insert Directors
INSERT INTO directors (first_name, last_name, birthdate, gender) VALUES 
('Christopher', 'Nolan', '1970-07-30', 'M'),
('Quentin', 'Tarantino', '1963-03-27', 'M'),
('Greta', 'Gerwig', '1983-08-04', 'F');

-- 2. Insert Movies
INSERT INTO movies (movie_name, genre, release_date, director_id) VALUES 
('Inception', 'Sci-Fi', '2010-07-16', 1),
('Pulp Fiction', 'Crime', '1994-10-14', 2),
('Barbie', 'Comedy', '2023-07-21', 3),
('Interstellar', 'Sci-Fi', '2014-11-07', 1);

-- 3. Insert Actors
INSERT INTO actors (first_name, last_name, birthdate, gender) VALUES 
('Leonardo', 'DiCaprio', '1974-11-11', 'M'),
('Samuel', 'L. Jackson', '1948-12-21', 'M'),
('Margot', 'Robbie', '1990-07-02', 'F'),
('Cillian', 'Murphy', '1976-05-25', 'M');

-- 4. Insert Act-ins
INSERT INTO act_ins (actor_id, movie_id, role) VALUES 
(1, 1, 'Dom Cobb'),
(2, 2, 'Jules Winnfield'),
(3, 3, 'Barbie'),
(4, 1, 'Robert Fischer'),
(4, 4, 'Dr. Mann');

-- 5. Insert Reviews
INSERT INTO reviews (score, comment, movie_id) VALUES 
(10, 'Mind-bending masterpiece!', 1),
(9, 'Classic Tarantino dialogue.', 2),
(8, 'Visually stunning and emotional.', 4),
(9, 'A fun and meaningful take on Barbie.', 3);