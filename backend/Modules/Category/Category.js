import express from 'express';
import {
  createCategory,
  getCategories,
  getCategoriesAdmin,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
} from './CategoryCn.js';
import { verifyToken, isAdmin } from '../../Middleware/authMidd.js';
import { uploadCategoryImage } from '../../Middleware/uploadMidd.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/admin', verifyToken, isAdmin, getCategoriesAdmin);
router.get('/:slug', getCategoryBySlug);

router.post('/', verifyToken, isAdmin, uploadCategoryImage.single('image'), createCategory);
router.put('/:id', verifyToken, isAdmin, uploadCategoryImage.single('image'), updateCategory);
router.delete('/:id', verifyToken, isAdmin, deleteCategory);

export default router;