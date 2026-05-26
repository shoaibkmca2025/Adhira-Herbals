import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import {
  createOrder,
  myOrders,
  getOrder,
  cancelOrder,
} from '../controllers/orderController.js';

const router = Router();
router.use(requireAuth);

router.post(
  '/',
  [
    body('shippingAddress.firstName').isString().notEmpty(),
    body('shippingAddress.lastName').isString().notEmpty(),
    body('shippingAddress.line1').isString().notEmpty(),
    body('shippingAddress.city').isString().notEmpty(),
    body('shippingAddress.state').isString().notEmpty(),
    body('shippingAddress.pincode').isString().notEmpty(),
    body('shippingAddress.phone').isString().notEmpty(),
    body('shippingAddress.email').isEmail(),
    body('paymentMethod').isIn(['upi', 'card', 'cod']),
    body('shippingMethod').optional().isIn(['standard', 'express']),
  ],
  validate,
  createOrder
);

router.get('/me', myOrders);
router.get('/:id', getOrder);
router.post('/:id/cancel', cancelOrder);

export default router;
