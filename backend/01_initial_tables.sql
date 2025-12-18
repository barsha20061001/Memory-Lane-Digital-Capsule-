-- Schema for the Digital Time Capsules Project

-- 1. USERS Table (assuming this exists from your registration logic)
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. MEMORIES Table (This is the table we need for the Create Capsule feature)
CREATE TABLE IF NOT EXISTS memories (
    memory_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id), -- Links to the user who created it
    title VARCHAR(100) NOT NULL,
    theme VARCHAR(50) NOT NULL,
    unlock_date DATE NOT NULL,
    is_locked BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);