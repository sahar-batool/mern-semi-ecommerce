require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./Models/User');
const Product = require('./Models/Product');

const seedData = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await User.deleteMany();
  await Product.deleteMany();

  const hashedPassword = await bcrypt.hash('adminpass123', 10);

  await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: hashedPassword,
    role: 'admin',
  });

  await Product.create([
     {
    name: 'Wireless Headphones',
    description: 'Comfortable over-ear wireless headphones with noise cancellation',
    price: 5000,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    stock: 20,
  },
  {
    name: 'Smartphone Stand',
    description: 'Adjustable aluminum stand for phones and tablets',
    price: 1200,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop',
    stock: 35,
  },
  {
    name: 'Cotton T-Shirt',
    description: 'Soft, breathable cotton t-shirt, unisex fit',
    price: 800,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    stock: 50,
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight running shoes with cushioned sole',
    price: 3500,
    category: 'Clothing',
    image:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    stock: 15,
  },
{
    name: 'Smart Watch',
    description: 'Fitness tracking smart watch with heart rate monitor',
    price: 6500,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    stock: 25,
  },
  {
    name: 'Bluetooth Speaker',
    description: 'Portable waterproof speaker with deep bass',
    price: 2800,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
    stock: 40,
  },
  {
    name: 'Denim Jacket',
    description: 'Classic fit denim jacket for all seasons',
    price: 3200,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    stock: 18,
  },
  {
    name: 'Leather Wallet',
    description: 'Genuine leather bifold wallet with card slots',
    price: 1500,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop',
    stock: 30,
  },
  { name: 'Power Bank 20000mAh', description: 'Fast-charging power bank with dual USB ports', price: 3200, category: 'Electronics', image: 'https://plus.unsplash.com/premium_photo-1776277143825-66db8476f4b7?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D', stock: 40 },
  { name: 'Wireless Mouse', description: 'Ergonomic silent-click mouse with USB receiver', price: 1500, category: 'Electronics', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=728&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D', stock: 50 },
  { name: 'Mechanical Keyboard', description: 'Backlit keyboard with tactile blue switches', price: 6500, category: 'Electronics', image: 'https://images.unsplash.com/photo-1635987391914-cb84b567e68f?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D', stock: 12 },
  { name: 'Hooded Sweatshirt', description: 'Warm fleece hoodie with front pocket', price: 2600, category: 'Clothing', image: 'https://images.unsplash.com/photo-1680292783974-a9a336c10366?q=80&w=394&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D', stock: 28 },
  { name: 'Travel Backpack', description: 'Water-resistant 25L backpack with laptop compartment', price: 3900, category: 'Accessories', image: 'https://images.unsplash.com/photo-1771121664468-fc4832de5872?q=80&w=725&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D', stock: 24 },
  { name: 'Sunglasses', description: 'UV400 polarized sunglasses with lightweight frame', price: 2200, category: 'Accessories', image: 'https://images.unsplash.com/photo-1610136649349-0f646f318053?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D', stock: 3 },
  { name: 'Steel Water Bottle', description: 'Insulated 750ml bottle, keeps drinks cold for 24 hours', price: 1100, category: 'Accessories', image: 'https://images.unsplash.com/photo-1683383277379-644816d886e2?q=80&w=327&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D', stock: 45 },
  { name: 'Ceramic Mug Set', description: 'Set of 4 glazed ceramic mugs, dishwasher safe', price: 1400, category: 'Home', image: 'https://images.unsplash.com/photo-1724905136831-97fc0cd4760d?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D', stock: 28 },
  { name: 'LED Table Lamp', description: 'Dimmable desk lamp with three brightness levels', price: 2800, category: 'Home', image: 'https://plus.unsplash.com/premium_photo-1672166939591-b2547bd18fca?q=80&w=327&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D', stock: 22 },
  { name: 'Wall Clock', description: 'Silent quartz wall clock, minimalist design', price: 1600, category: 'Home', image: 'https://plus.unsplash.com/premium_photo-1725075084045-4c1ee2ab9349?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D', stock: 0 }

])

  console.log('Data seeded successfully');
  process.exit();
};

seedData();