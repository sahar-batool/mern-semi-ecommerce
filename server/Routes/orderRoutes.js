// Routes/orderRoutes.js
const express = require('express');
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, placeOrder);
router.get('/my', protect, getMyOrders);   // must be before '/:id'
router.get('/', protect, admin, getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;