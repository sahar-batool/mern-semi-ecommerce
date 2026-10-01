const express = require('express');
const {
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Current Logged-in User Routes
router
  .route('/me')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Admin-Only Routes
router
  .route('/')
  .get(protect, admin, getUsers);

router
  .route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)     // Optional: Admin update role/user details
  .delete(protect, admin, deleteUser);  // Optional: Admin delete user

module.exports = router;