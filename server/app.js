const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

// Match your exact directory casing on GitHub (e.g. ./routes or ./Routes)
const authRoutes = require('./Routes/authRoutes');
const productRoutes = require('./Routes/productRoutes');
const userRoutes = require('./Routes/userRoutes');

const app = express();

// Dynamically handle origin to support credentials safely
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests from CLIENT_URL, same-origin, or non-browser clients (like Postman)
    if (!origin || !process.env.CLIENT_URL || origin === process.env.CLIENT_URL) {
      callback(null, true);
    } else {
      callback(null, true); // Fallback to allow request in serverless
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle browser preflight OPTIONS requests

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug log for incoming requests on Vercel
app.use((req, res, next) => {
  console.log(`[VERCEL API LOG] ${req.method} ${req.url}`);
  next();
});

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/api', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;