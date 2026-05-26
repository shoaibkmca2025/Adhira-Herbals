import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { HttpError } from '../middleware/error.js';

// ── Dashboard ──────────────────────────────────────────────
export const stats = asyncHandler(async (_req, res) => {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalOrders,
    paidOrders,
    revenueAgg,
    last30Agg,
    productCount,
    userCount,
    lowStock,
    recentOrders,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ paymentStatus: 'paid' }),
    Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          revenue: { $sum: '$total' },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Product.countDocuments(),
    User.countDocuments(),
    Product.find({ stock: { $lt: 10 } }).limit(5),
    Order.find().sort('-createdAt').limit(5).populate('user', 'name email'),
  ]);

  res.json({
    totalOrders,
    paidOrders,
    totalRevenue: revenueAgg[0]?.total || 0,
    productCount,
    userCount,
    last30: last30Agg,
    lowStock,
    recentOrders,
  });
});

// ── Products ───────────────────────────────────────────────
export const adminListProducts = asyncHandler(async (_req, res) => {
  const products = await Product.find().sort('-createdAt');
  res.json({ products });
});

export const adminCreateProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ product });
});

export const adminUpdateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new HttpError(404, 'Product not found');
  res.json({ product });
});

export const adminDeleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new HttpError(404, 'Product not found');
  res.json({ ok: true });
});

// ── Orders ─────────────────────────────────────────────────
export const adminListOrders = asyncHandler(async (req, res) => {
  const { status, paymentStatus, q } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (paymentStatus) filter.paymentStatus = paymentStatus;
  if (q) filter.orderNumber = { $regex: q, $options: 'i' };
  const orders = await Order.find(filter).sort('-createdAt').populate('user', 'name email');
  res.json({ orders });
});

export const adminUpdateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const valid = ['placed', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!valid.includes(status)) throw new HttpError(400, 'Invalid status');
  const order = await Order.findById(req.params.id);
  if (!order) throw new HttpError(404, 'Order not found');
  order.status = status;
  order.statusHistory.push({ status, note });
  await order.save();
  res.json({ order });
});

// ── Users ──────────────────────────────────────────────────
export const adminListUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().sort('-createdAt');
  res.json({ users: users.map((u) => u.toSafeJSON()) });
});

export const adminUpdateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) throw new HttpError(400, 'Invalid role');
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  if (!user) throw new HttpError(404, 'User not found');
  res.json({ user: user.toSafeJSON() });
});
