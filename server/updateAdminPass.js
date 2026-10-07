require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./Models/User');

const updatePassword = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const hashedPassword = await bcrypt.hash('admin321', 10);

  await User.findOneAndUpdate(
    { email: 'admin@example.com' },
    { password: hashedPassword }
  );

  console.log('Admin password updated successfully');
  process.exit();
};

updatePassword();