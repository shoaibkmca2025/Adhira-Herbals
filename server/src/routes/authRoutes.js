import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import {
  register,
  login,
  me,
  updateProfile,
  addAddress,
  deleteAddress,
} from '../controllers/authController.js';

const router = Router();

router.post(
  '/register',
  [
    body('name').isString().trim().isLength({ min: 2 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isString().isLength({ min: 8 }),
  ],
  validate,
  register
);

router.post(
  '/login',
  [body('email').isEmail().normalizeEmail(), body('password').isString().notEmpty()],
  validate,
  login
);

router.get('/me', requireAuth, me);
router.patch('/me', requireAuth, updateProfile);
router.post('/addresses', requireAuth, addAddress);
router.delete('/addresses/:id', requireAuth, deleteAddress);

export default router;
