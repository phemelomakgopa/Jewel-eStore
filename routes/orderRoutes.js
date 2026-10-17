const express = require('express');
const { createOrder, getAllOrders } = require('../controllers/orderController');

const router = express.Router();

router.post('/', createOrder);
router.get('/', getAllOrders);

module.exports = router;