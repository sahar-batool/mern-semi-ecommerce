// Routes/orderRoutes.js
const express = require('express');
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
} = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, placeOrder);
router.get('/my', protect, getMyOrders);   // must be before '/:id'
router.get('/', protect, admin, getAllOrders);
router.get('/:id', protect, getOrderById);

module.exports = router;