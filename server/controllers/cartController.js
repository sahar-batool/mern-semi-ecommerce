const Cart = require('../Models/Cart');
const Product = require('../Models/Product');

const getCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  res.status(200).json({
    success: true,
    cart,
  });
};

const addToCart = async (req, res) => {
  const { productId } = req.body;
  const quantity = Number(req.body.quantity) || 1;

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();

  const updatedCart = await Cart.findById(cart._id).populate('items.product');

  res.status(200).json({
    success: true,
    cart: updatedCart,
  });
};

//update items inside cart
const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;

  if (!quantity || quantity < 1) {
    res.status(400);
    throw new Error('Quantity must be at least 1');
  }

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const item = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (!item) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  item.quantity = Number(quantity);

  await cart.save();

  const updatedCart = await Cart.findById(cart._id).populate('items.product');

  res.status(200).json({
    success: true,
    cart: updatedCart,
  });
};

//remove item from this function

const removeFromCart = async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  await cart.save();

  const updatedCart = await Cart.findById(cart._id).populate('items.product');

  res.status(200).json({
    success: true,
    cart: updatedCart,
  });
};


//clear cart
const clearCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.items = [];

  await cart.save();

  res.status(200).json({
    success: true,
    cart,
  });
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };