import * as jalaali from 'jalaali-js';
import Order from '../Order/OrderMd.js';
import Product from '../Product/ProductMd.js';
import User from '../User/UserMd.js';
import { PAID_STATUSES, ALL_STATUSES } from '../../Utils/orderStatus.js';

const TEHRAN_TZ = 'Asia/Tehran';
const TEHRAN_OFFSET_MS = 3.5 * 60 * 60 * 1000; // ایران از ۱۴۰۱ ساعت تابستانی ندارد
const DAY_MS = 24 * 60 * 60 * 1000;
const LOW_STOCK_THRESHOLD = 5;

// تاریخ پرداخت؛ برای سفارش‌های قدیمی که paidAt ندارند از createdAt استفاده می‌شود
const paidDateExpr = { $ifNull: ['$payment.paidAt', '$createdAt'] };

// شروع امروز به وقت تهران (مستقل از تایم‌زون سرور)
const startOfTehranDay = (date = new Date()) => {
  const shifted = date.getTime() + TEHRAN_OFFSET_MS;
  return new Date(Math.floor(shifted / DAY_MS) * DAY_MS - TEHRAN_OFFSET_MS);
};

// شروع ماه شمسی جاری به وقت تهران
const startOfJalaliMonth = () => {
  const shifted = new Date(Date.now() + TEHRAN_OFFSET_MS);
  const { jy, jm } = jalaali.toJalaali(
    shifted.getUTCFullYear(),
    shifted.getUTCMonth() + 1,
    shifted.getUTCDate()
  );
  const { gy, gm, gd } = jalaali.toGregorian(jy, jm, 1);
  return new Date(Date.UTC(gy, gm - 1, gd) - TEHRAN_OFFSET_MS);
};

// جمع درآمد و تعداد سفارشات پرداخت‌شده (و لغو‌نشده) از یک تاریخ به بعد
const getPaidSummary = async (from) => {
  const [row] = await Order.aggregate([
    { $match: { status: { $in: PAID_STATUSES } } },
    { $addFields: { paidDate: paidDateExpr } },
    { $match: { paidDate: { $gte: from } } },
    { $group: { _id: null, revenue: { $sum: '$totalAmount' }, orders: { $sum: 1 } } },
  ]);
  return { revenue: row?.revenue || 0, orders: row?.orders || 0 };
};

// @desc    Get dashboard overview stats
// @route   GET /api/dashboard/overview
// @access  Admin
export const getDashboardOverview = async (req, res) => {
  try {
    const [today, month, overall, totalUsers, totalProducts, statusRows, lowStockDocs] =
      await Promise.all([
        getPaidSummary(startOfTehranDay()),
        getPaidSummary(startOfJalaliMonth()),
        getPaidSummary(new Date(0)),
        User.countDocuments({ role: 'user' }),
        Product.countDocuments({ isActive: true }),
        Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        Product.find({
          isActive: true,
          variants: { $elemMatch: { isActive: true, stock: { $lt: LOW_STOCK_THRESHOLD } } },
        })
          .select('name variants')
          .limit(10),
      ]);

    // همه‌ی وضعیت‌ها با مقدار پیش‌فرض صفر، تا فرانت با undefined سروکار نداشته باشد
    const statusBreakdown = Object.fromEntries(ALL_STATUSES.map((s) => [s, 0]));
    statusRows.forEach((row) => {
      if (row._id in statusBreakdown) statusBreakdown[row._id] = row.count;
    });

    const lowStockProducts = lowStockDocs
      .map((p) => ({
        _id: p._id,
        name: p.name,
        lowVariants: p.variants
          .filter((v) => v.isActive && v.stock < LOW_STOCK_THRESHOLD)
          .map((v) => ({
            label: [v.voltage, v.size, v.brand].filter(Boolean).join(' - ') || v.sku,
            stock: v.stock,
          })),
      }))
      .filter((p) => p.lowVariants.length > 0);

    res.status(200).json({
      today,
      month,
      overall: {
        totalPaidOrders: overall.orders,
        totalRevenue: overall.revenue,
        totalUsers,
        totalProducts,
      },
      // سفارش‌هایی که پول‌شان آمده و منتظر شروع پردازش توسط ادمین‌اند
      pendingOrdersCount: statusBreakdown.paid,
      statusBreakdown,
      lowStockProducts,
    });
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت آمار داشبورد', error: error.message });
  }
};

// @desc    Get best selling products
// @route   GET /api/dashboard/best-sellers
// @access  Admin
export const getBestSellers = async (req, res) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 5, 1), 20);

    const bestSellers = await Order.aggregate([
      { $match: { status: { $in: PAID_STATUSES } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.lineTotal' },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: limit },
    ]);

    res.status(200).json(bestSellers);
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت پرفروش‌ترین محصولات', error: error.message });
  }
};

// @desc    Get revenue chart data (last N days, zero-filled)
// @route   GET /api/dashboard/revenue-chart?days=14
// @access  Admin
export const getRevenueChart = async (req, res) => {
  try {
    const days = Math.min(Math.max(Number(req.query.days) || 7, 1), 90);
    const startDate = startOfTehranDay(new Date(Date.now() - (days - 1) * DAY_MS));

    const rows = await Order.aggregate([
      { $match: { status: { $in: PAID_STATUSES } } },
      { $addFields: { paidDate: paidDateExpr } },
      { $match: { paidDate: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$paidDate', timezone: TEHRAN_TZ } },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
    ]);

    const byDate = new Map(rows.map((r) => [r._id, r]));

    // روزهای بدون فروش هم با مقدار صفر در نمودار می‌آیند تا نمودار پیوسته باشد
    const result = Array.from({ length: days }, (_, i) => {
      const key = new Date(startDate.getTime() + i * DAY_MS + TEHRAN_OFFSET_MS)
        .toISOString()
        .slice(0, 10);
      const row = byDate.get(key);
      return { _id: key, revenue: row?.revenue || 0, orders: row?.orders || 0 };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت نمودار درآمد', error: error.message });
  }
};