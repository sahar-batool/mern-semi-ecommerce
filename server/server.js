require('dotenv').config();
const app = require('./app');
const connectDB = require('./Config/databases');

const PORT = process.env.PORT || 5000;

// Ensure DB is connected before handling any incoming serverless request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ message: 'Database connection failure' });
  }
});

// For local development (Vercel ignores app.listen in production)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}

// CRITICAL: Export app for Vercel serverless execution
module.exports = app;