const express = require("express");
const { protect, admin } = require("../middlewares/authMiddleware"); 
const { getStats } = require("../controllers/dashboardController");

const router = express.Router();

router.get("/stats", protect, admin, getStats);

module.exports = router;