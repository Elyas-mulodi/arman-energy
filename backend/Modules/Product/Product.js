import express from 'express';
import {
  createProduct,
  getProducts,
  getProductsAdmin,
  getProductBySlug,
  updateProduct,
  deleteProductImage,
  deleteProduct,
} from './ProductCn.js';
import { verifyToken, isAdmin } from '../../Middleware/authMidd.js';
import { uploadProductImages } from '../../Middleware/uploadMidd.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/admin', verifyToken, isAdmin, getProductsAdmin);
router.get('/:slug', getProductBySlug);

router.post('/', verifyToken, isAdmin, uploadProductImages.array('images', 6), createProduct);
router.put('/:id', verifyToken, isAdmin, uploadProductImages.array('images', 6), updateProduct);
router.delete('/:id/images', verifyToken, isAdmin, deleteProductImage);
router.delete('/:id', verifyToken, isAdmin, deleteProduct);

export default router;