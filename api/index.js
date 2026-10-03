const connectDB = require('../server/Config/databases');
const app = require('../server/app');

let isConnected = false;

module.exports = async (req, res) => {
  try {
    if (!isConnected) {
      await connectDB();
      isConnected = true;
    }
    return app(req, res);
  } catch (err) {
    console.error('Serverless function error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};