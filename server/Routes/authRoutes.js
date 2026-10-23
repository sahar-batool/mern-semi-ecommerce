const express = require('express');
const { registerUser, loginUser, getMe, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect, admin } = require('../middlewares/authMiddleware')
const {registerValidation,loginValidation,validate,} = require('../middlewares/validationMiddleware');

const router = express.Router();

router.post('/register',registerValidation, validate, registerUser);
router.post('/login',loginValidation, validate, loginUser);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;