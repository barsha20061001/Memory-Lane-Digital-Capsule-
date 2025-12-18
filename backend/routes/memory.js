// memorylane-backend/routes/memory.js

const express = require('express');
const router = express.Router();
const { createMemory } = require('../controllers/memoryController');
const db = require('../db');
const auth = require('./auth'); // Import the authentication middleware

// The auth middleware (auth) will be applied to all memory routes 
// to ensure the user is logged in before they can interact with their memories.

// POST /api/memories/ - Create a new memory
// memorylane-backend/routes/memory.js

// ... (existing imports and other routes)

// POST /api/memories/ - Create a new memory

// Route to create a new time capsule
router.post('/', createMemory);

module.exports = router;


router.post('/', auth, async (req, res) => {
    // We get the user ID from the auth middleware (req.userId)
    const userId = req.userId; 
    
    // Get the memory details from the request body
    const { title, content, date_recorded, location, is_private } = req.body;

    // 1. Define the SQL query to insert the new memory
    const text = 
        `INSERT INTO memories(
            user_id, title, content, date_recorded, location, is_private
        ) VALUES($1, $2, $3, $4, $5, $6) 
        RETURNING *`;
        
    const values = [
        userId, 
        title, 
        content, 
        date_recorded, 
        location || null, // Use null if location is not provided
        is_private !== undefined ? is_private : true // Default to true (private)
    ];

    try {
        // 2. Execute the query
        const result = await db.query(text, values);
        
        // 3. Send a success response with the created memory details
        res.status(201).json({ 
            message: 'Memory created successfully!',
            memory: result.rows[0]
        });

    } catch (err) {
        // 4. Handle errors
        console.error('Error creating memory:', err.stack);
        res.status(500).json({ error: 'Failed to create memory.' });
    }
});

// memorylane-backend/routes/memory.js
// backend/routes/memory.js

// This route sends all capsules from the database to the frontend
router.get('/', async (req, res) => {
    try {
        const { pool } = require('../db');
        const result = await pool.query('SELECT * FROM memories ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching capsules" });
    }
});
// ... (existing router.post('/') Create route)

// GET /api/memories/ - Get all memories for the logged-in user
router.get('/', auth, async (req, res) => {
    const userId = req.userId; 
    
    // 1. Define the SQL query to select all memories for the user
    const text = 'SELECT * FROM memories WHERE user_id = $1 ORDER BY date_recorded DESC';
    const values = [userId];

    try {
        // 2. Execute the query
        const result = await db.query(text, values);
        
        // 3. Send a success response with the list of memories
        res.status(200).json(result.rows);

    } catch (err) {
        // 4. Handle errors
        console.error('Error reading all memories:', err.stack);
        res.status(500).json({ error: 'Failed to retrieve memories.' });
    }
});
 
// memorylane-backend/routes/memory.js

// ... (Read All Memories route ends here, around line 80)

// GET /api/memories/:id - Get a single memory (START HERE)
router.get('/:id', auth, async (req, res) => {
    const userId = req.userId;
    const memoryId = req.params.id; // Get the memory ID from the URL parameter
    
    // 1. Define the SQL query to select the memory by ID AND user_id
    const text = 'SELECT * FROM memories WHERE id = $1 AND user_id = $2';
    const values = [memoryId, userId];

    try {
        // 2. Execute the query
        const result = await db.query(text, values);
        
        // 3. Check if the memory was found (and belongs to the user)
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Memory not found or access denied.' });
        }

        // 4. Send a success response with the single memory
        res.status(200).json(result.rows[0]);

    } catch (err) {
        // 5. Handle errors
        console.error('Error reading single memory:', err.stack);
        res.status(500).json({ error: 'Failed to retrieve memory.' });
    }
}); // (END HERE)


// PUT /api/memories/:id - Update a memory (This route should now follow)
// memorylane-backend/routes/memory.js

// ... (Existing Read Single Memory route ends here)

// PUT /api/memories/:id - Update a memory
router.put('/:id', auth, async (req, res) => {
    const userId = req.userId;
    const memoryId = req.params.id;
    const updates = req.body;

    // Define allowed updatable fields
    const allowedFields = [
        'title', 'content', 'date_recorded', 'location', 'is_private'
    ];
    
    let queryParts = [];
    let values = [];
    let paramIndex = 1; // Start index for SQL parameters ($1, $2, ...)

    // 1. Build the dynamic SQL query string
    for (const field of allowedFields) {
        if (updates[field] !== undefined) {
            queryParts.push(`${field} = $${paramIndex}`);
            values.push(updates[field]);
            paramIndex++;
        }
    }

    // 2. Check if any fields were provided for update
    if (queryParts.length === 0) {
        return res.status(400).json({ error: 'No valid fields provided for update.' });
    }

    // 3. Construct the full SQL query
    const text = 
        `UPDATE memories SET 
         ${queryParts.join(', ')} 
         WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
         RETURNING *`;
    
    // Add WHERE clause parameters (memoryId and userId)
    values.push(memoryId);
    values.push(userId);

    try {
        // 4. Execute the query
        const result = await db.query(text, values);
        
        // 5. Check if the memory was actually updated (must exist and belong to the user)
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Memory not found or access denied.' });
        }

        // 6. Send success response
        res.status(200).json({ 
            message: 'Memory updated successfully!',
            memory: result.rows[0] 
        });

    } catch (err) {
        // 7. Handle errors
        console.error('Error updating memory:', err.stack);
        res.status(500).json({ error: 'Failed to update memory.' });
    }
});

// DELETE /api/memories/:id - Delete a memory
router.delete('/:id', auth, async (req, res) => {
    const userId = req.userId;
    const memoryId = req.params.id;

    // 1. Define the SQL query to delete the memory by ID AND user_id
    const text = 'DELETE FROM memories WHERE id = $1 AND user_id = $2';
    const values = [memoryId, userId];

    try {
        // 2. Execute the query
        const result = await db.query(text, values);
        
        // 3. Check if any rows were deleted
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Memory not found or access denied.' });
        }

        // 4. Send a success response (204 No Content is standard for successful deletions)
        res.status(204).send(); 

    } catch (err) {
        // 5. Handle errors
        console.error('Error deleting memory:', err.stack);
        res.status(500).json({ error: 'Failed to delete memory.' });
    }
});

// ... (rest of the file)

// ... (rest of the file)
// ... (rest of the file)

// ... (rest of the file)
module.exports = router;