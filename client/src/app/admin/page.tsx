'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Wallet,
  CalendarDays,
  Clock,
  Users,
  TrendingUp,
  AlertTriangle,
  Trophy,
  RefreshCw,
  PieChart,
} from 'lucide-react';
import api from '@/lib/axios';
import { DashboardOverview, BestSeller, RevenueChartPoint } from '@/types/dashboard';
import { formatPrice } from '@/lib/utils';
import StatCard from '@/components/admin/StatCard';
import RevenueChart from '@/components/admin/RevenueChart';
import OrderStatusBreakdown from '@/components/admin/OrderStatusBreakdown';

const PERIODS = [7, 14, 30] as const;
type Period = (typeof PERIODS)[number];

const fa = (n: number) => n.toLocaleString('fa-IR');

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [bestSellers, setBestSellers] = useState<BestSeller[]>([]);
  const [loadStatus, setLoadStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [reloadKey, setReloadKey] = useState(0);

  const [period, setPeriod] = useState<Period>(14);
  const [chartData, setChartData] = useState<RevenueChartPoint[]>([]);
  const [chartLoading, setChartLoading] = useState(true);

  // آمار کلی + پرفروش‌ها
  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setLoadStatus('loading');
      try {
        const [overviewRes, bestRes] = await Promise.all([
          api.get<DashboardOverview>('/dashboard/overview', { signal: controller.signal }),
          api.get<BestSeller[]>('/dashboard/best-sellers', {
            params: { limit: 5 },
            signal: controller.signal,
          }),
        ]);
        setOverview(overviewRes.data);
        setBestSellers(bestRes.data);
        setLoadStatus('success');
      } catch (error) {
        if (axios.isCancel(error)) return;
        setLoadStatus('error');
      }
    };

    load();
    return () => controller.abort();
  }, [reloadKey]);

  // نمودار: با تغییر بازه جداگانه لود میشود
  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setChartLoading(true);
      try {
        const { data } = await api.get<RevenueChartPoint[]>('/dashboard/revenue-chart', {
          params: { days: period },
          signal: controller.signal,
        });
        setChartData(data);
        setChartLoading(false);
      } catch (error) {
        if (axios.isCancel(error)) return;
        setChartData([]);
        setChartLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [period, reloadKey]);

  if (loadStatus === 'loading' && !overview) {
    return (
      <div>
        <div className="mb-6 h-8 w-32 animate-pulse rounded bg-ink-800/5" />
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-36 animate-pulse rounded-xl bg-ink-800/5" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="h-80 animate-pulse rounded-xl bg-ink-800/5 lg:col-span-2" />
          <div className="h-80 animate-pulse rounded-xl bg-ink-800/5" />
        </div>
      </div>
    );
  }

  if (loadStatus === 'error' || !overview) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
        <AlertTriangle className="h-8 w-8 text-red-400" />
        <p className="text-sm text-ink-800/50">خطا در دریافت اطلاعات داشبورد</p>
        <button
          onClick={() => setReloadKey((k) => k + 1)}
          className="flex items-center gap-1.5 rounded-md bg-brand-500 px-4 py-2 text-xs font-bold text-white hover:bg-brand-600"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          تلاش مجدد
        </button>
      </div>
    );
  }

  const chartTotal = chartData.reduce((sum, p) => sum + p.revenue, 0);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-black text-ink-900 sm:text-2xl">داشبورد</h1>
        <button
          onClick={() => setReloadKey((k) => k + 1)}
          className="flex items-center gap-1.5 rounded-md border border-ink-800/10 bg-white px-3 py-2 text-xs font-bold text-ink-800/60 transition hover:text-brand-600"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          به‌روزرسانی
        </button>
      </div>

      {/* کارت‌های آمار */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          <StatCard
            key="today"
            icon={Wallet}
            label="درآمد امروز"
            value={formatPrice(overview.today.revenue)}
            hint={`${fa(overview.today.orders)} سفارش`}
          />,
          <StatCard
            key="month"
            icon={CalendarDays}
            label="درآمد این ماه"
            value={formatPrice(overview.month.revenue)}
            hint={`${fa(overview.month.orders)} سفارش`}
          />,
          <StatCard
            key="pending"
            icon={Clock}
            label="در انتظار رسیدگی"
            value={fa(overview.pendingOrdersCount)}
            hint={overview.pendingOrdersCount > 0 ? 'مشاهده سفارش‌ها' : 'همه رسیدگی شده'}
            href="/admin/orders?status=paid"
            tone={overview.pendingOrdersCount > 0 ? 'warning' : 'default'}
          />,
          <StatCard
            key="users"
            icon={Users}
            label="تعداد مشتریان"
            value={fa(overview.overall.totalUsers)}
            hint={`${fa(overview.overall.totalProducts)} محصول فعال`}
          />,
        ].map((card, index) => (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {card}
          </motion.div>
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* نمودار درآمد */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-ink-800/10 bg-white p-5 lg:col-span-2"
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-brand-500" />
                <h2 className="text-sm font-bold text-ink-900">روند درآمد</h2>
              </div>
              {!chartLoading && (
                <p className="mt-1 text-xs text-ink-800/40">
                  مجموع {fa(period)} روز اخیر: {formatPrice(chartTotal)}
                </p>
              )}
            </div>

            <div className="flex rounded-md bg-ink-100 p-0.5">
              {PERIODS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`rounded px-3 py-1.5 text-xs font-bold transition ${
                    period === p ? 'bg-white text-brand-600 shadow-sm' : 'text-ink-800/50'
                  }`}
                >
                  {fa(p)} روز
                </button>
              ))}
            </div>
          </div>

          {chartLoading ? (
            <div className="h-[280px] animate-pulse rounded-lg bg-ink-800/5" />
          ) : (
            <RevenueChart data={chartData} />
          )}
        </motion.div>

        {/* توزیع وضعیت سفارش‌ها */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-xl border border-ink-800/10 bg-white p-5"
        >
          <div className="mb-4 flex items-center gap-2">
            <PieChart className="h-4 w-4 text-brand-500" />
            <h2 className="text-sm font-bold text-ink-900">وضعیت سفارش‌ها</h2>
          </div>
          <OrderStatusBreakdown breakdown={overview.statusBreakdown} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* پرفروش‌ترین‌ها */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-ink-800/10 bg-white p-5"
        >
          <div className="mb-4 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-brand-500" />
            <h2 className="text-sm font-bold text-ink-900">پرفروش‌ترین محصولات</h2>
          </div>

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
                      {fa(index + 1)}
                    </span>
                    <span className="truncate text-sm font-medium text-ink-900">{product.name}</span>
                  </div>
                  <div className="shrink-0 text-left">
                    <p className="text-xs font-bold text-brand-600">
                      {formatPrice(product.totalRevenue)}
                    </p>
                    <p className="text-[11px] text-ink-800/40">{fa(product.totalSold)} فروش</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* موجودی کم */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-xl border border-ink-800/10 bg-white p-5"
        >
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
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
                  <p className="mb-1.5 text-xs font-bold text-ink-900">{product.name}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {product.lowVariants.map((variant, i) => (
                      <span
                        key={i}
                        className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                          variant.stock === 0
                            ? 'bg-red-50 text-red-600'
                            : 'bg-amber-50 text-amber-600'
                        }`}
                      >
                        {variant.label}: {fa(variant.stock)}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}