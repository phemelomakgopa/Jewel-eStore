const { db } = require('../config/firebaseConfig');

// POST /orders - create new order
const createOrder = async (req, res) => {
    try
    {
        const { user, items } = req.body || {};
        if (!user || !Array.isArray(items) || items.length === 0)
        {
            return res.status(400).json({ error: 'An order needs a user and at least one item' });
        }

        const newOrder = {
            user,
            items,
            status: 'pending',
            timestamp: new Date(),
        };

        const orderRef = await db.collection('orders').add(newOrder);
        res.status(201).json({ id: orderRef.id, ...newOrder });
    }
    catch (error)
    {
        console.error('Error creating order: ', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
};

// GET /orders - fetch all orders
const getAllOrders = async (req, res) => {
    try
    {
        const snapshot = await db.collection('orders').get();
        const orders = [];

        snapshot.forEach(doc => {
            orders.push({ id: doc.id, ...doc.data() })
        });

        res.status(200).json(orders);
    }
    catch (error)
    {
        console.error('Error fetching orders: ', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

module.exports = { createOrder, getAllOrders };

