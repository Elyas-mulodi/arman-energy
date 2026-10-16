import cron from 'node-cron';
import Order from '../Modules/Order/OrderMd.js';
import { ENV } from '../Config/env.js';

const cleanupPendingOrders = async () => {
  try {
    const cutoffDate = new Date(Date.now() - ENV.PENDING_ORDER_TTL_MINUTES * 60 * 1000);

    const result = await Order.deleteMany({
      status: 'pending_payment',
      createdAt: { $lt: cutoffDate },
    });

    console.log(
      `🧹 پاک‌سازی سفارشات معلق: ${result.deletedCount} سفارش حذف شد (قدیمی‌تر از ${ENV.PENDING_ORDER_TTL_MINUTES} دقیقه)`
    );
  } catch (error) {
    console.error('خطا در پاک‌سازی سفارشات معلق:', error.message);
  }
};

export const startCleanupJob = () => {
  cron.schedule('0 * * * *', cleanupPendingOrders, { timezone: 'Asia/Tehran' });
  cleanupPendingOrders(); // یک‌بار هم موقع بالا آمدن سرور
  console.log('✅ کار پاک‌سازی خودکار سفارشات معلق فعال شد (هر ۱ ساعت)');
};