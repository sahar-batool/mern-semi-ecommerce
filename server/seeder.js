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
    image: 'https://via.placeholder.com/300x300?text=Headphones',
    stock: 20,
  },
  {
    name: 'Smartphone Stand',
    description: 'Adjustable aluminum stand for phones and tablets',
    price: 1200,
    category: 'Electronics',
    image: 'https://via.placeholder.com/300x300?text=Phone+Stand',
    stock: 35,
  },
  {
    name: 'Cotton T-Shirt',
    description: 'Soft, breathable cotton t-shirt, unisex fit',
    price: 800,
    category: 'Clothing',
    image: 'https://via.placeholder.com/300x300?text=T-Shirt',
    stock: 50,
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight running shoes with cushioned sole',
    price: 3500,
    category: 'Clothing',
    image: 'https://via.placeholder.com/300x300?text=Shoes',
    stock: 15,
  },
  ]);

  console.log('Data seeded successfully');
  process.exit();
};

seedData();