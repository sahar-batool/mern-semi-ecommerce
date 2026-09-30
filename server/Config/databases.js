const mongoose = require('mongoose');

// Maintain a cached connection state across serverless function invocations
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // 1. If connection already exists, return it immediately
  if (cached.conn) {
    return cached.conn;
  }

  // 2. If no connection promise exists, start connecting
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Prevents Mongoose from holding queries in buffer if DB is down
      serverSelectionTimeoutMS: 5000, // Fails fast in 5s instead of waiting 10s
    };

    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongooseInstance) => {
      console.log('MongoDB connected successfully');
      return mongooseInstance;
    });
  }

  // 3. Await connection promise
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // Reset promise so next request can retry
    console.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }

  return cached.conn;
};

module.exports = connectDB;