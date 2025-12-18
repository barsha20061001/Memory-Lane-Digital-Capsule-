// memorylane-backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

require('./db'); // This imports db.js and runs the connection test inside it.

const app = express();

const userRouter = require('./routes/user');
//const memoryRouter = require('./routes/memory'); // <-- ADD THIS IMPORT
const memoryRouter = require('./routes/memory'); // <--- ADD THIS

// Middleware: Setup CORS to allow requests from your frontend's port
//app.use(cors({
  //  origin: ['http://localhost:5173', 'http://localhost:5174'], // Allow only your frontend URL
  //  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
   // credentials: true, 
   // optionsSuccessStatus: 204
//}));//
// backend/server.js (Around line 17)

// 🛑 DELETE OR COMMENT OUT THE ENTIRE app.use(cors) BLOCK HERE

// 🎯 FINAL CORS SOLUTION: MANUAL HEADER INJECTION
//app.use((req, res, next) => {
    // 1. Allow the necessary origins (5173 and 5174)
   // const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
   // const origin = req.headers.origin;
   // if (allowedOrigins.includes(origin)) {
      //  res.setHeader('Access-Control-Allow-Origin', origin);
    //} else {
        // Fallback for tools/tests that might not send an Origin header
      //  res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
    ////}

    // 2. Allow all required methods and headers
    //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    //res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    //res.setHeader('Access-Control-Allow-Credentials', true);

    // 3. Handle preflight (OPTIONS) requests immediately
   // if (req.method === 'OPTIONS') {
      //  return res.sendStatus(200);
    //}

    //next();
//});

// Middleware (The express.json() block remains below this)
//app.use(express.json());
// ... rest of your server.js


// backend/server.js (Around line 17)

// Middleware: Setup CORS to allow requests from your frontend's port
app.use(cors({
    origin: 'http://localhost:5173', // <-- SIMPLE, CORRECT 5173
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
}));

// Middleware
app.use(express.json()); // ... This must follow the cors middleware
// ... rest of your server.js



app.use(express.json()); // Allows the server to accept JSON body data

app.use('/api/users', userRouter);

app.use('/api/memories', memoryRouter); // <--- ADD THIS

// Basic Test Route
app.get('/', (req, res) => {
    res.send('MemoryLane Backend API is running!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access the API at http://localhost:${PORT}`);
});