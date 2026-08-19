import express from 'express';
import { getDashboardOverview, getBestSellers, getRevenueChart } from './DashboardCn.js';
import { verifyToken, isAdmin } from '../../Middleware/authMidd.js';

const router = express.Router();

router.use(verifyToken, isAdmin);

router.get('/overview', getDashboardOverview);
router.get('/best-sellers', getBestSellers);
router.get('/revenue-chart', getRevenueChart);

export default router;