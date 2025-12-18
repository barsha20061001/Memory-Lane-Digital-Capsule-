const pool = require('../db'); // Adjust path if necessary

// 🛑 IMPORTANT: Replace 1 with an actual user_id from your users table 🛑
const HARDCODED_USER_ID = 1; 

exports.createMemory = async (req, res) => {
    const { title, theme, unlockDate } = req.body;

    // Bypass login check for quick finishing
    const user_id = 1; 

    if (!title || !theme || !unlockDate) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const query = `
            INSERT INTO memories (user_id, title, theme, unlock_date, is_locked)
            VALUES ($1, $2, $3, $4, TRUE)
            RETURNING *`;

        const values = [user_id, title, theme, unlockDate];
        const result = await pool.query(query, values);

        res.status(201).json({ 
            message: 'Capsule created successfully!',
            capsule: result.rows[0] 
        });

    } catch (error) {
        console.error('DATABASE SAVE ERROR:', error);
        res.status(500).json({ message: 'Server error when saving capsule.' });
    }
};