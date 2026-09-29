require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./Models/User');
const Product = require('./Models/Product');

const seedData = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await User.deleteMany();
  await Product.deleteMany();

  const hashedPassword = await bcrypt.hash('admin123', 10);

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
  ]);

  console.log('Data seeded successfully');
  process.exit();
};

seedData();