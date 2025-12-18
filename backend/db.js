const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// 🚀 AUTO-CREATE TABLE SCRIPT
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS memories (
    memory_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(100) NOT NULL,
    theme VARCHAR(50) NOT NULL,
    unlock_date DATE NOT NULL,
    is_locked BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
`;

pool.query(createTableQuery)
    .then(() => console.log('✅ Memories table is ready (checked/created)'))
    .catch(err => console.error('❌ Error creating table:', err));

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool,
};