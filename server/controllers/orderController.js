
const Cart = require('../Models/Cart');
const Order = require('../Models/Order');

const placeOrder = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    // Drop items whose product was deleted
    const validItems = cart ? cart.items.filter((item) => item.product) : [];

    if (validItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty' });
    }

    // Check stock
    for (const item of validItems) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${item.product.name}`,
        });
      }
    }

    // Snapshot the items
    const orderItems = validItems.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.image || '',
      quantity: item.quantity,
    }));

    // Calculate the total on the server
    const totalPrice = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress: req.body?.shippingAddress,
      totalPrice,
    });

    // Clear the cart
    cart.items = [];
    await cart.save();

    res.status(201).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/my
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const isOwner = order.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// GET /api/orders  (admin)
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
};

// PUT /api/orders/:id/status  (admin)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (['delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ success: false, message: 'Order can no longer be changed' });
    }

    order.status = status;
    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// Add to controllers/orderController.js

// PUT /api/orders/:id/cancel  (order owner)
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this order' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Only pending orders can be cancelled' });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

module.exports = { placeOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, cancelOrder };