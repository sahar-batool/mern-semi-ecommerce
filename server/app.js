const express = require('express');
const cors = require('cors')
const morgan = require('morgan')
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const authRoutes = require('./Routes/authRoutes');
const productRoutes = require('./Routes/productRoutes');

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (development only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});


app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes);
app.use(notFound)
app.use(errorHandler)
module.exports = app;