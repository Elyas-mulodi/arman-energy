import express from 'express';
import {
  createOrder,
  verifyOrderPayment,
  getMyOrders,
  getOrderByNumber,
  getAllOrders,
  updateOrderStatus,
} from './OrderCn.js';
import { verifyToken, isAdmin } from '../../Middlewares/authMidd.js';

const router = express.Router();

router.get('/verify', verifyOrderPayment);

router.use(verifyToken);

router.post('/', createOrder);
router.get('/my', getMyOrders);
router.get('/:orderNumber', getOrderByNumber);

router.get('/', isAdmin, getAllOrders);
router.put('/:id/status', isAdmin, updateOrderStatus);

export default router;