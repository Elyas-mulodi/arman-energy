'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ShoppingBag, Users, Package, AlertTriangle, TrendingUp } from 'lucide-react';
import api from '@/lib/axios';
import { DashboardOverview, BestSeller, RevenueChartPoint } from '@/types/dashboard';
import { formatPrice } from '@/lib/utils';
import StatCard from '@/components/admin/StatCard';
import RevenueChart from '@/components/admin/RevenueChart';

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [bestSellers, setBestSellers] = useState<BestSeller[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueChartPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [overviewRes, bestSellersRes, revenueRes] = await Promise.all([
          api.get<DashboardOverview>('/dashboard/overview'),
          api.get<BestSeller[]>('/dashboard/best-sellers', { params: { limit: 5 } }),
          api.get<RevenueChartPoint[]>('/dashboard/revenue-chart', { params: { days: 14 } }),
        ]);

        setOverview(overviewRes.data);
        setBestSellers(bestSellersRes.data);
        setRevenueData(revenueRes.data);
      } catch {
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-ink-800/5 sm:h-28" />
        ))}
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-ink-800/40">
        خطا در دریافت اطلاعات داشبورد
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-5 text-xl font-black text-ink-900 sm:mb-6 sm:text-2xl">داشبورد</h1>

      {/* کارت‌های آماری: ۲ ستون رو موبایل، ۴ ستون از lg */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <StatCard
            icon={Wallet}
            label="درآمد این ماه"
            value={formatPrice(overview.month.revenue)}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <StatCard
            icon={ShoppingBag}
            label="سفارشات این ماه"
            value={overview.month.orders.toLocaleString('fa-IR')}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            icon={Package}
            label="تعداد محصولات فعال"
            value={overview.overall.totalProducts.toLocaleString('fa-IR')}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <StatCard
            icon={Users}
            label="تعداد مشتریان"
            value={overview.overall.totalUsers.toLocaleString('fa-IR')}
          />
        </motion.div>
      </div>

      {/* نمودار + هشدار موجودی: از md دوستونی میشه، نه فقط lg */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="min-w-0 rounded-xl border border-ink-800/10 bg-white p-4 sm:p-5 md:col-span-2"
        >
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 shrink-0 text-brand-500" />
            <h2 className="text-sm font-bold text-ink-900">روند درآمد (۱۴ روز اخیر)</h2>
          </div>
          {/* توجه: RevenueChart باید داخلش از ResponsiveContainer recharts استفاده کنه
              وگرنه رو موبایل باعث اسکرول افقی کل صفحه میشه */}
          <RevenueChart data={revenueData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-xl border border-ink-800/10 bg-white p-4 sm:p-5"
        >
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
            <h2 className="text-sm font-bold text-ink-900">هشدار موجودی کم</h2>
          </div>

          {overview.lowStockProducts.length === 0 ? (
            <p className="py-8 text-center text-xs text-ink-800/40">
              همه‌ی محصولات موجودی کافی دارند
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {overview.lowStockProducts.map((product) => (
                <div key={product._id} className="border-b border-ink-800/5 pb-3 last:border-0">
                  <p className="mb-1.5 truncate text-xs font-bold text-ink-900">{product.name}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {product.lowVariants.map((variant, i) => (
                      <span
                        key={i}
                        className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600"
                      >
                        {variant.label}: {variant.stock}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* پرفروش‌ترین محصولات */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 rounded-xl border border-ink-800/10 bg-white p-4 sm:p-5"
      >
        <h2 className="mb-4 text-sm font-bold text-ink-900">پرفروش‌ترین محصولات</h2>

        {bestSellers.length === 0 ? (
          <p className="py-8 text-center text-xs text-ink-800/40">هنوز فروشی ثبت نشده</p>
        ) : (
          <div className="flex flex-col gap-1">
            {bestSellers.map((product, index) => (
              <div
                key={product._id}
                className="flex items-center justify-between gap-3 rounded-md px-2 py-2.5 hover:bg-ink-100/50"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-800/5 text-xs font-bold text-ink-800/50">
                    {index + 1}
                  </span>
                  <span className="truncate text-sm font-medium text-ink-900">{product.name}</span>
                </div>
                <div className="flex shrink-0 items-center gap-2 text-xs sm:gap-4">
                  <span className="hidden text-ink-800/50 sm:inline">
                    {product.totalSold.toLocaleString('fa-IR')} فروش
                  </span>
                  <span className="font-bold text-brand-600">
                    {formatPrice(product.totalRevenue)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}