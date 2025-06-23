CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstname VARCHAR(100),
  lastname VARCHAR(100),
  email VARCHAR(255) UNIQUE,
  birthdate DATE,
  city VARCHAR(100),
  zipcode VARCHAR(10),
  password VARCHAR(255),
  is_admin BOOLEAN DEFAULT FALSE
);