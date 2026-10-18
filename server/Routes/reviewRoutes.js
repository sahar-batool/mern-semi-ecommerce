const express = require("express");
const { protect } = require("../middlewares/authMiddleware"); 
const c = require("../controllers/reviewController");

const router = express.Router();

router.get("/product/:productId", c.getProductReviews);
router.post("/product/:productId", protect, c.createReview);
router.put("/:id", protect, c.updateReview);
router.delete("/:id", protect, c.deleteReview);

module.exports = router;