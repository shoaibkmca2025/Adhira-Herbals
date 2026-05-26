import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import {
  listProductReviews,
  createReview,
  deleteReview,
} from '../controllers/reviewController.js';

const router = Router();

router.get('/:productId', listProductReviews);

router.post(
  '/:productId',
  requireAuth,
  [
    body('rating').isInt({ min: 1, max: 5 }),
    body('title').optional().isString().isLength({ max: 120 }),
    body('body').optional().isString().isLength({ max: 2000 }),
  ],
  validate,
  createReview
);

router.delete('/:id', requireAuth, deleteReview);

export default router;
