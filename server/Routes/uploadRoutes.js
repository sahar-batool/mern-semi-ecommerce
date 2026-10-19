const express = require('express');
const { protect, admin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');
const { uploadImage } = require('../controllers/uploadController');

const router = express.Router();

router.post('/', protect, admin, upload.single('image'), uploadImage);

module.exports = router;