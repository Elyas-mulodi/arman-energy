import Order from '../Order/OrderMd.js';
import Product from '../Product/ProductMd.js';
import User from '../User/UserMd.js';

export const getDashboardOverview = async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      todayOrdersCount,
      monthOrdersCount,
      totalPaidOrders,
      revenueAgg,
      monthRevenueAgg,
      totalUsers,
      totalProducts,
      pendingOrdersCount,
      lowStockProducts,
    ] = await Promise.all([
      Order.countDocuments({ status: 'paid', createdAt: { $gte: startOfToday } }),

      Order.countDocuments({ status: 'paid', createdAt: { $gte: startOfMonth } }),

      Order.countDocuments({ status: 'paid' }),

      Order.aggregate([
        { $match: { status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),

      Order.aggregate([
        { $match: { status: 'paid', createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),

      User.countDocuments({ role: 'user' }),

      Product.countDocuments({ isActive: true }),

      Order.countDocuments({ status: 'paid' }),

      Product.find({ isActive: true, 'variants.stock': { $lt: 5 } })
        .select('name variants')
        .limit(10),
    ]);

    res.status(200).json({
      today: {
        orders: todayOrdersCount,
      },
      month: {
        orders: monthOrdersCount,
        revenue: monthRevenueAgg[0]?.total || 0,
      },
      overall: {
        totalPaidOrders,
        totalRevenue: revenueAgg[0]?.total || 0,
        totalUsers,
        totalProducts,
      },
      pendingOrdersCount,
      lowStockProducts: lowStockProducts.map((p) => ({
        _id: p._id,
        name: p.name,
        lowVariants: p.variants
          .filter((v) => v.stock < 5)
          .map((v) => ({
            label: [v.voltage, v.size, v.brand].filter(Boolean).join(' - '),
            stock: v.stock,
          })),
      })),
    });
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت آمار داشبورد', error: error.message });
  }
};

export const getBestSellers = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const bestSellers = await Order.aggregate([
      { $match: { status: 'paid' } },
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
      { $limit: Number(limit) },
    ]);

    res.status(200).json(bestSellers);
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت پرفروش‌ترین محصولات', error: error.message });
  }
};

export const getRevenueChart = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(days));
    startDate.setHours(0, 0, 0, 0);

    const chartData = await Order.aggregate([
      { $match: { status: 'paid', createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json(chartData);
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت نمودار درآمد', error: error.message });
  }
};