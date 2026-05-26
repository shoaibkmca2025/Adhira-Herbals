import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import {
  getCart,
  addToCart,
  updateItem,
  removeItem,
  clearCart,
} from '../controllers/cartController.js';

const router = Router();
router.use(requireAuth);

router.get('/', getCart);
router.post(
  '/',
  [
    body('productId').isMongoId(),
    body('quantity').optional().isInt({ min: 1, max: 99 }),
    body('variantLabel').optional({ nullable: true }).isString(),
  ],
  validate,
  addToCart
);
router.patch(
  '/:itemId',
  [body('quantity').isInt({ min: 0, max: 99 })],
  validate,
  updateItem
);
router.delete('/:itemId', removeItem);
router.delete('/', clearCart);

export default router;
