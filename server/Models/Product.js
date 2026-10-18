const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required:[true,'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim:true
    },
    image: {
      type:String,
      trim:true
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    ratingsAverage: { 
      type: Number,
      default: 0 
    },
    ratingsCount: { 
      type: Number,
      default: 0 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);