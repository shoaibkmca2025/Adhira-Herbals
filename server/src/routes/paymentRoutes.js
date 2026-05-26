import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { simulateCheckout, verifyPayment } from '../controllers/paymentController.js';

const router = Router();
router.use(requireAuth);

router.post('/simulate', simulateCheckout);
router.post('/verify', verifyPayment);

export default router;
