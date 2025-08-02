const express = require('express');
const { createOrder, getAllOrders } = require('../controllers/orderController');

const router = express.Router();

router.post('/orders', createOrder);
router.get('/orders', getAllOrders);

module.exports = router;