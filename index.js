const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const requireDb = require('./middleware/requireDb');

// This is the API only; the website is the React app in client/.
app.get('/', (req, res) => {
    res.type('text').send(
        'Jewel eStore API. Endpoints: /api/test, /api/products, /api/orders\n' +
        'Looking for the shop? Run "cd client && npm start" and open http://localhost:3000'
    );
});

// Health check (works without Firestore)
app.use('/api/test', require('./routes/testRoute'));

// Routes
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', requireDb, productRoutes);

const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', requireDb, orderRoutes);

// Server 
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
