import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import { HttpError } from '../middleware/error.js';

export const listProducts = asyncHandler(async (req, res) => {
  const { category, q, sort = 'featured', limit = 24, page = 1 } = req.query;
  const filter = { isPublished: true };
  if (category && category !== 'all') filter.category = category;
  if (q) filter.name = { $regex: q, $options: 'i' };

  const sortMap = {
    featured: { isFeatured: -1, createdAt: -1 },
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    newest: { createdAt: -1 },
    rating: { rating: -1 },
  };

  const pageNum = Math.max(1, parseInt(page, 10));
  const perPage = Math.min(48, parseInt(limit, 10));

  const [items, total] = await Promise.all([
    Product.find(filter)
      .sort(sortMap[sort] || sortMap.featured)
      .skip((pageNum - 1) * perPage)
      .limit(perPage),
    Product.countDocuments(filter),
  ]);

  res.json({
    items,
    total,
    page: pageNum,
    perPage,
    hasMore: pageNum * perPage < total,
  });
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isPublished: true });
  if (!product) throw new HttpError(404, 'Product not found');

  const reviews = await Review.find({ product: product._id })
    .populate('user', 'name')
    .sort('-createdAt')
    .limit(20);

  const related = await Product.find({
    _id: { $ne: product._id },
    isPublished: true,
    $or: [{ category: product.category }, { isFeatured: true }],
  })
    .limit(3)
    .sort('-isFeatured -rating');

  res.json({ product, reviews, related });
});

export const getFeatured = asyncHandler(async (_req, res) => {
  const items = await Product.find({ isPublished: true, isFeatured: true })
    .sort('-rating')
    .limit(6);
  res.json({ items });
});
