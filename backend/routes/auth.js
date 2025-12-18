// memorylane-backend/routes/auth.js

const jwt = require('jsonwebtoken');

// Middleware function to check for a valid JWT token
const auth = (req, res, next) => {
    // 1. Get the token from the request header (Authorization: Bearer <token>)
    const authHeader = req.header('Authorization');
    
    // Check if the header exists and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // Extract the token part
    const token = authHeader.replace('Bearer ', '');

    try {
        // 2. Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Attach the decoded user ID to the request object
        req.userId = decoded.userId;
        
        // 4. Proceed to the next middleware or route handler
        next();
        
    } catch (ex) {
        // If verification fails (e.g., token is expired or invalid)
        res.status(400).json({ error: 'Invalid token.' });
    }
};

module.exports = auth;