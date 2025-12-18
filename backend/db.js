// memorylane-backend/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Optional: Test the connection on server startup
pool.query('SELECT NOW()')
    .then(res => console.log('Database connected successfully at:', res.rows[0].now))
    .catch(err => console.error('Database connection error:', err.stack));

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool,
};