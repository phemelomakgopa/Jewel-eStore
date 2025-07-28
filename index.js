const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const testRoute = require('./routes/testRoute');
app.use('/api/test', testRoute);

// Server 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server is running on http://localhost:${PORT}');
});