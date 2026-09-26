const express = require('express');
const {getUserProfile,updateUserProfile,getUsers,getUserById,} = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/me', protect, getUserProfile);
router.put('/me', protect, updateUserProfile);
router.get('/', protect, admin, getUsers);
router.get('/:id', protect, admin, getUserById);

module.exports = router;