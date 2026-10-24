require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./Models/Order');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const delivered = await Order.updateMany(
    { status: 'delivered', isPaid: { $ne: true } },
    [{ $set: { isPaid: true, paidAt: '$updatedAt', paymentMethod: 'COD' } }]
  );
  const others = await Order.updateMany(
    { paymentMethod: { $exists: false } },
    { $set: { paymentMethod: 'COD', isPaid: false } }
  );

  console.log('Delivered fixed:', delivered.modifiedCount);
  console.log('Others fixed:', others.modifiedCount);
  await mongoose.disconnect();
})();