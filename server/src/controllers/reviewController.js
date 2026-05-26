import asyncHandler from 'express-async-handler';
import Review from '../models/Review.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { HttpError } from '../middleware/error.js';

export const listProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate('user', 'name')
    .sort('-createdAt');
  res.json({ reviews });
});

export const createReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) throw new HttpError(404, 'Product not found');

  const { rating, title, body } = req.body;

  const purchased = await Order.exists({
    user: req.user._id,
    paymentStatus: { $in: ['paid', 'pending'] },
    'items.product': product._id,
  });

  try {
    const review = await Review.create({
      product: product._id,
      user: req.user._id,
      rating,
      title,
      body,
      verifiedPurchase: Boolean(purchased),
    });
    await Review.recalcProduct(product._id);
    const populated = await review.populate('user', 'name');
    res.status(201).json({ review: populated });
  } catch (err) {
    if (err.code === 11000) throw new HttpError(409, 'You already reviewed this product');
    throw err;
  }
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new HttpError(404, 'Review not found');
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new HttpError(403, 'Not your review');
  }
  const pid = review.product;
  await review.deleteOne();
  await Review.recalcProduct(pid);
  res.json({ ok: true });
});
