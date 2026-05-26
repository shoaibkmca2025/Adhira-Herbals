import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import { HttpError } from '../middleware/error.js';
import { paymentService } from '../services/payment.js';

/**
 * For mock provider only: produces a paymentId + signature so the client can
 * complete the flow without a real gateway redirect.
 */
export const simulateCheckout = asyncHandler(async (req, res) => {
  if (paymentService.provider !== 'mock') {
    throw new HttpError(400, 'Simulate is only available for the mock provider');
  }
  const { orderId } = req.body;
  if (!orderId) throw new HttpError(400, 'orderId is required');
  const sim = paymentService.simulateClientCheckout(orderId);
  res.json({ orderId, ...sim });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { orderId, paymentId, signature, internalOrderId } = req.body;
  const order = await Order.findById(internalOrderId);
  if (!order) throw new HttpError(404, 'Order not found');
  if (order.user.toString() !== req.user._id.toString()) throw new HttpError(403, 'Not your order');

  const ok = paymentService.verify({ orderId, paymentId, signature });
  if (!ok) {
    order.paymentStatus = 'failed';
    order.statusHistory.push({ status: 'payment_failed', note: 'Signature mismatch' });
    await order.save();
    throw new HttpError(400, 'Payment verification failed');
  }

  order.paymentStatus = 'paid';
  order.status = 'processing';
  order.paymentRef = { orderId, paymentId, signature };
  order.statusHistory.push({ status: 'paid', note: 'Payment verified' });
  await order.save();

  // Clear user's cart now that payment is confirmed
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

  res.json({ order });
});
