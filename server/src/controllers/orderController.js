import asyncHandler from 'express-async-handler';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { HttpError } from '../middleware/error.js';
import { paymentService } from '../services/payment.js';
import { env } from '../config/env.js';

const FREE_SHIPPING_THRESHOLD = 4000; // INR
const EXPRESS_FEE = 150;

function calcShipping(subtotal, method) {
  if (method === 'express') return EXPRESS_FEE;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 49;
}

export const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, shippingMethod = 'standard', paymentMethod } = req.body;

  if (!['upi', 'card', 'cod'].includes(paymentMethod)) {
    throw new HttpError(400, 'Invalid payment method');
  }

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) throw new HttpError(400, 'Cart is empty');

  const items = cart.items.map((i) => ({
    product: i.product._id,
    name: i.product.name,
    image: i.product.images?.[0]?.url,
    variantLabel: i.variantLabel,
    quantity: i.quantity,
    unitPrice: i.unitPrice,
  }));

  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const shippingFee = calcShipping(subtotal, shippingMethod);
  const total = subtotal + shippingFee;

  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress,
    shippingMethod,
    paymentMethod,
    paymentProvider: env.paymentProvider,
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
    subtotal,
    shippingFee,
    total,
    currency: env.currency,
    statusHistory: [{ status: 'placed', note: 'Order created' }],
  });

  // For online payments, create a gateway order so the client can launch checkout
  let gatewayOrder = null;
  if (paymentMethod !== 'cod') {
    gatewayOrder = await paymentService.createOrder({
      amount: total * 100, // paise
      currency: env.currency,
      receipt: order.orderNumber,
    });
    order.paymentRef = { orderId: gatewayOrder.id };
    await order.save();
  } else {
    // COD orders confirm immediately
    order.status = 'processing';
    order.statusHistory.push({ status: 'processing', note: 'COD confirmed' });
    await order.save();
    // Clear the cart now since payment isn't required
    cart.items = [];
    await cart.save();
  }

  res.status(201).json({
    order,
    gateway: gatewayOrder
      ? {
          provider: env.paymentProvider,
          orderId: gatewayOrder.id,
          amount: gatewayOrder.amount,
          currency: gatewayOrder.currency,
          keyId: env.paymentProvider === 'razorpay' ? env.razorpayKeyId : 'mock',
        }
      : null,
  });
});

export const myOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
  res.json({ orders });
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new HttpError(404, 'Order not found');
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new HttpError(403, 'Not your order');
  }
  res.json({ order });
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new HttpError(404, 'Order not found');
  if (order.user.toString() !== req.user._id.toString()) throw new HttpError(403, 'Not your order');
  if (!['placed', 'processing'].includes(order.status)) {
    throw new HttpError(400, `Cannot cancel an order that is ${order.status}`);
  }
  order.status = 'cancelled';
  order.statusHistory.push({ status: 'cancelled', note: 'Cancelled by user' });
  await order.save();
  res.json({ order });
});
