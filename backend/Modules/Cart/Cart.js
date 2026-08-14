import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from './CartCn.js';
import { verifyToken } from '../../Middleware/authMidd.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:itemId', updateCartItem);
router.delete('/:itemId', removeCartItem);
router.delete('/', clearCart);

export default router;