// memorylane-backend/routes/user.js

const express = require('express');
const router = express.Router();
const db = require('../db'); // Import the database connection module
const jwt = require('jsonwebtoken'); // FOR LOGIN ROUTE
// and the existing:
const bcrypt = require('bcrypt');
// We will add bcrypt later for password hashing
const saltRounds = 10;

// POST /api/users/register - Route for new user registration
router.post('/register', async (req, res) => {
    // 1. Get user input (email and password)
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Please provide username, email, and password.' });
    }

try {
        // 3. Check if user already exists
        const checkUserText = 'SELECT * FROM users WHERE email = $1';
        const checkUserResult = await db.query(checkUserText, [email]);

        if (checkUserResult.rows.length > 0) {
            return res.status(409).json({ error: 'User with this email already exists.' });
        }

        // 4. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 5. Insert the new user into the database
        const insertUserText = 
            'INSERT INTO users (username, email, password_hash) VALUES($1, $2, $3) RETURNING id';
        const insertUserValues = [username, email, hashedPassword];
        const result = await db.query(insertUserText, insertUserValues);

        // 6. Send success response
        res.status(201).json({ 
            message: 'User registered successfully!', 
            userId: result.rows[0].id 
        });

    } catch (err) {
        console.error('Error during user registration:', err.stack);
        res.status(500).json({ error: 'Registration failed.' });
    }
});

// memorylane-backend/routes/user.js

// ... (Registration route ends here)

// POST /api/users/login - Route for user login
// memorylane-backend/routes/user.js

// ... (Registration route ends here)

// POST /api/users/login - Route for user login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password.' });
    }

    try {
        const userText = 'SELECT * FROM users WHERE email = $1';
        const userResult = await db.query(userText, [email]);
        const user = userResult.rows[0];

        // This is the logic that generates the error message you are seeing!
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful!',
            userId: user.id,
            token: token
        });

    } catch (err) {
        console.error('Error during user login:', err.stack);
        res.status(500).json({ error: 'Login failed.' });
    }
});

module.exports = router; // <-- Ensure this is the very last line in the file