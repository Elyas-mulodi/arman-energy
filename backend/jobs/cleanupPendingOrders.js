import cron from 'node-cron';
import Order from '../Modules/Order/OrderMd.js';

const PENDING_ORDER_MAX_AGE_HOURS = 24;

const cleanupPendingOrders = async () => {
  try {
    const cutoffDate = new Date(Date.now() - PENDING_ORDER_MAX_AGE_HOURS * 60 * 60 * 1000);

    // --- لاگ‌های تشخیصی موقت ---
    const allPending = await Order.find({ status: 'pending_payment' }).select('orderNumber status createdAt');
    console.log(`\n🔍 تعداد سفارشات pending_payment: ${allPending.length}`);
    console.log(`🔍 cutoffDate (سفارشات قدیمی‌تر از این پاک میشن): ${cutoffDate.toISOString()}`);
    console.log(`🔍 الان: ${new Date().toISOString()}`);
    allPending.forEach((o) => {
      console.log(`   - ${o.orderNumber}: status="${o.status}", createdAt=${o.createdAt.toISOString()}, قدیمی‌تر از cutoff؟ ${o.createdAt < cutoffDate}`);
    });
    // --- پایان لاگ‌های تشخیصی ---

    const result = await Order.deleteMany({
      status: 'pending_payment',
      createdAt: { $lt: cutoffDate },
    });

    if (result.deletedCount > 0) {
      console.log(`🧹 پاک‌سازی خودکار: ${result.deletedCount} سفارش پرداخت‌نشده‌ی قدیمی حذف شد`);
    } else {
      console.log('🧹 هیچ سفارش واجد شرایطی برای پاک‌سازی پیدا نشد\n');
    }
  } catch (error) {
    console.error('خطا در پاک‌سازی سفارشات معلق:', error.message);
  }
};

export const startCleanupJob = () => {
  cron.schedule('0 * * * *', cleanupPendingOrders);
  console.log('✅ کار پاک‌سازی خودکار سفارشات معلق فعال شد');
};