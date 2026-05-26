import { Router } from 'express';
import { listProducts, getProductBySlug, getFeatured } from '../controllers/productController.js';

const router = Router();

router.get('/', listProducts);
router.get('/featured', getFeatured);
router.get('/:slug', getProductBySlug);

export default router;
