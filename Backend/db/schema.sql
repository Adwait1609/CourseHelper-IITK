-- Create schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS myschema;

-- Drop tables if they exist to avoid conflicts when recreating the schema
DROP TABLE IF EXISTS myschema.courses;
DROP TABLE IF EXISTS myschema.users;

-- Create users table with more fields
CREATE TABLE myschema.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    profile_picture VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create courses table with reference to users
CREATE TABLE myschema.courses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    description TEXT,
    credit INTEGER,
    image VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES myschema.users(id) ON DELETE CASCADE
);

-- Index for faster lookups on common queries
CREATE INDEX idx_courses_user_id ON myschema.courses(user_id);
