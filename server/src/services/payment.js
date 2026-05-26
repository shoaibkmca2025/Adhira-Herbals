import crypto from 'crypto';
import { env } from '../config/env.js';

/**
 * Razorpay-compatible payment service.
 * Mock mode generates deterministic order IDs & signatures so the frontend
 * flow exercises the exact same shape as production Razorpay.
 *
 * Swap in real Razorpay by setting PAYMENT_PROVIDER=razorpay + keys.
 */

function mockCreateOrder({ amount, currency, receipt }) {
  const id = `order_mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return {
    id,
    entity: 'order',
    amount,
    amount_paid: 0,
    amount_due: amount,
    currency,
    receipt,
    status: 'created',
    created_at: Math.floor(Date.now() / 1000),
  };
}

function mockSign(orderId, paymentId) {
  return crypto
    .createHmac('sha256', env.jwtSecret) // mock uses jwt secret as shared key
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
}

function mockVerify({ orderId, paymentId, signature }) {
  const expected = mockSign(orderId, paymentId);
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

async function razorpayCreateOrder() {
  throw new Error('Razorpay provider not configured. Set PAYMENT_PROVIDER=mock or add Razorpay deps + keys.');
}

export const paymentService = {
  provider: env.paymentProvider,

  async createOrder({ amount, currency = env.currency, receipt }) {
    // amount is in smallest unit (paise/cents) per Razorpay convention
    if (env.paymentProvider === 'razorpay') return razorpayCreateOrder({ amount, currency, receipt });
    return mockCreateOrder({ amount, currency, receipt });
  },

  /** For the mock provider, returns a fake but verifiable payment + signature. */
  simulateClientCheckout(orderId) {
    const paymentId = `pay_mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    return { paymentId, signature: mockSign(orderId, paymentId) };
  },

  verify({ orderId, paymentId, signature }) {
    if (env.paymentProvider === 'razorpay') {
      const expected = crypto
        .createHmac('sha256', env.razorpayKeySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');
      return expected === signature;
    }
    try {
      return mockVerify({ orderId, paymentId, signature });
    } catch {
      return false;
    }
  },
};
