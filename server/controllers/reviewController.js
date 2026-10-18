const Review = require("../Models/Review");
const Product = require("../Models/Product");
const mongoose = require('mongoose')

// Recalculate the product's average after any change
const updateProductRatings = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    { $group: { _id: "$product", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  await Product.findByIdAndUpdate(productId, {
    ratingsAverage: stats.length ? Math.round(stats[0].avg * 10) / 10 : 0,
    ratingsCount: stats.length ? stats[0].count : 0,
  });
};


exports.getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "name")
      .sort("-createdAt");
    res.json(reviews);
  } catch (err) { next(err); }
};

exports.createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const review = await Review.create({
      product: product._id,
      user: req.user._id,
      rating,
      comment,
    });
    await updateProductRatings(product._id);
    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "You already reviewed this product" });
    }
    next(err);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }
    review.rating = req.body.rating ?? review.rating;
    review.comment = req.body.comment ?? review.comment;
    await review.save();
    await updateProductRatings(review.product);
    res.json(review);
  } catch (err) { next(err); }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    const isOwner = review.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }
    await review.deleteOne();
    await updateProductRatings(review.product);
    res.json({ message: "Review deleted" });
  } catch (err) { next(err); }
};