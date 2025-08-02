const { Timestamp } = require('firebase-admin/firestore');
const { db } = require('../config/firebaseConfig');

// POST /orders - create new order
const createOrder = async (req, res) => {
    try
    {
        const newOrder = {
            user: req.body.user,
            items: req.body.items,
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

        res.status(500).json(orders);
    }
    catch (error)
    {
        console.error('Error fetching orrders: ', error);
        res.status(500).json({ error: 'Failed to orders'});
    }
};

module.exports = { createOrder, getAllOrders };

