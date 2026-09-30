const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = require('./app');
const connectDB = require('./Config/databases');

const PORT = process.env.PORT || 5000;

// Connect DB once when the serverless container initializes
connectDB().catch((err) => {
  console.error('Initial DB connection failed:', err);
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}

// Export app for Vercel
module.exports = app;