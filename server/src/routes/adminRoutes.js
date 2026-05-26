import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import {
  stats,
  adminListProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminListOrders,
  adminUpdateOrderStatus,
  adminListUsers,
  adminUpdateUserRole,
} from '../controllers/adminController.js';

const router = Router();
router.use(requireAuth, requireAdmin);

router.get('/stats', stats);

router.get('/products', adminListProducts);
router.post('/products', adminCreateProduct);
router.patch('/products/:id', adminUpdateProduct);
router.delete('/products/:id', adminDeleteProduct);

router.get('/orders', adminListOrders);
router.patch('/orders/:id/status', adminUpdateOrderStatus);

router.get('/users', adminListUsers);
router.patch('/users/:id/role', adminUpdateUserRole);

export default router;
