'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, AlertTriangle, ArrowRight, Zap } from 'lucide-react';
import { Order, OrderStatus } from '@/types/order';
import { getOrderByNumber } from '@/lib/orders';
import { formatPrice } from '@/lib/utils';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import OrderStatusUpdater from '@/components/admin/OrderStatusUpdater';
import OrderStatusFlow from '@/components/admin/OrderStatusFlow';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminOrderDetailPage() {
  const params = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    getOrderByNumber(params.orderNumber)
      .then((data) => {
        setOrder(data);
        setStatus('success');
      })
      .catch(() => setStatus('error'));
  }, [params.orderNumber]);

  const handleStatusUpdated = (newStatus: OrderStatus) => {
    setOrder((prev) => (prev ? { ...prev, status: newStatus } : prev));
  };

  if (status === 'loading') {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
      </div>
    );
  }

  if (status === 'error' || !order) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
        <AlertTriangle className="h-8 w-8 text-red-400" />
        <p className="text-sm text-ink-800/50">سفارش یافت نشد</p>
      </div>
    );
  }

  const customer = typeof order.user === 'string' ? null : order.user;

  return (
    <div>
      <Link
        href="/admin/orders"
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-ink-800/50 hover:text-brand-600"
      >
        <ArrowRight className="h-3.5 w-3.5" />
        بازگشت به لیست سفارشات
      </Link>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="break-all font-mono text-lg font-black text-ink-900 sm:text-xl" dir="ltr">
              {order.orderNumber}
            </h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="mt-1 text-xs text-ink-800/40">ثبت‌شده در {formatDate(order.createdAt)}</p>
        </div>

        <div className="shrink-0">
          <OrderStatusUpdater
            orderId={order._id}
            currentStatus={order.status}
            onUpdated={handleStatusUpdated}
          />
        </div>
      </div>

      {/* روی موبایل، فلوچارت رو با اسکرول افقی نگه دار تا مراحل فشرده و ناخوانا نشن */}
      <div className="mb-6 overflow-x-auto">
        <div className="min-w-[420px]">
          <OrderStatusFlow status={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* آیتم‌های سفارش */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-ink-800/10 bg-white p-4 sm:p-5 lg:col-span-2"
        >
          <h2 className="mb-4 text-sm font-bold text-ink-900">اقلام سفارش</h2>
          <div className="flex flex-col divide-y divide-ink-800/5">
            {order.items.map((item, index) => (
              <div key={index} className="flex flex-wrap items-center gap-3 py-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-ink-100 text-ink-800/30">
                  <Zap className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-ink-900">{item.name}</p>
                  {item.variantLabel && (
                    <p className="truncate text-xs text-ink-800/40">{item.variantLabel}</p>
                  )}
                </div>
                <div className="flex w-full items-center justify-between gap-3 pr-13 sm:w-auto sm:pr-0">
                  <p className="text-xs text-ink-800/50">
                    {item.quantity.toLocaleString('fa-IR')} عدد
                  </p>
                  <p className="text-sm font-bold text-ink-900">{formatPrice(item.lineTotal)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2 border-t border-ink-800/10 pt-4 text-sm">
            <div className="flex justify-between text-ink-800/60">
              <span>جمع کالاها</span>
              <span>{formatPrice(order.itemsTotal)}</span>
            </div>
            <div className="flex justify-between text-ink-800/60">
              <span>هزینه ارسال</span>
              <span>{order.shippingCost === 0 ? 'رایگان' : formatPrice(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between border-t border-ink-800/10 pt-3 text-base font-black text-ink-900">
              <span>مبلغ کل</span>
              <span className="text-brand-600">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </motion.div>

        {/* اطلاعات مشتری و ارسال */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex flex-col gap-6"
        >
          <div className="rounded-xl border border-ink-800/10 bg-white p-4 sm:p-5">
            <h2 className="mb-3 text-sm font-bold text-ink-900">اطلاعات مشتری</h2>
            <div className="space-y-1.5 text-sm text-ink-800/60">
              <p>{customer?.fullName || order.shippingAddress.fullName}</p>
              <p dir="ltr" className="text-left">
                {customer?.phone || order.shippingAddress.phone}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-ink-800/10 bg-white p-4 sm:p-5">
            <h2 className="mb-3 text-sm font-bold text-ink-900">آدرس ارسال</h2>
            <div className="space-y-1 text-sm text-ink-800/60">
              <p>
                {order.shippingAddress.province}، {order.shippingAddress.city}
              </p>
              <p className="leading-6">{order.shippingAddress.fullAddress}</p>
              {order.shippingAddress.postalCode && (
                <p className="font-mono text-xs" dir="ltr">
                  کد پستی: {order.shippingAddress.postalCode}
                </p>
              )}
            </div>
          </div>

          {order.payment.refId && (
            <div className="rounded-xl border border-ink-800/10 bg-white p-4 sm:p-5">
              <h2 className="mb-3 text-sm font-bold text-ink-900">اطلاعات پرداخت</h2>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-ink-800/50">
                  <span>کد پیگیری</span>
                  <span className="break-all font-mono text-ink-800" dir="ltr">
                    {order.payment.refId}
                  </span>
                </div>
                {order.payment.paidAt && (
                  <div className="flex justify-between text-ink-800/50">
                    <span>زمان پرداخت</span>
                    <span>{formatDate(order.payment.paidAt)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {order.payment.note && (
            <div className="rounded-md bg-amber-50 p-4 text-xs font-bold text-amber-600">
              {order.payment.note}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}