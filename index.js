const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 500;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

const orderRoutes = require('./routes/orderRoutes');
app.use('/api', orderRoutes);

//Test route
app.get("api/test", (req, res)=> {
    res.json({ message: "API is working correctly" });
});

// Server 
app.listen(PORT, () => console.log('Server running on http://localhost:${PORT}'));