'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, AlertTriangle, ArrowRight, Clock } from 'lucide-react';
import { Order } from '@/types/order';
import { getOrderByNumber } from '@/lib/orders';
import { formatPrice } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
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

export default function UserOrderDetailPage() {
  const params = useParams<{ orderNumber: string }>();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (!isInitialized) return;

    if (!user) {
      router.replace(
        `/login?redirect=${encodeURIComponent(`/profile/orders/${params.orderNumber}`)}`
      );
      return;
    }

    let cancelled = false;

    getOrderByNumber(params.orderNumber)
      .then((data) => {
        if (cancelled) return;
        setOrder(data);
        setStatus('success');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [isInitialized, user, params.orderNumber, router]);

  if (!isInitialized || status === 'loading') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
      </div>
    );
  }

  if (status === 'error' || !order) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-3 px-4 text-center">
        <AlertTriangle className="h-8 w-8 text-red-400" />
        <p className="text-sm text-ink-800/60">سفارش یافت نشد یا دسترسی به آن ندارید</p>
        <Link href="/profile?tab=orders" className="text-sm font-bold text-brand-600 hover:underline">
          بازگشت به سفارشات من
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link
        href="/profile?tab=orders"
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-ink-800/50 hover:text-brand-600"
      >
        <ArrowRight className="h-3.5 w-3.5" />
        بازگشت به سفارشات من
      </Link>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="break-all font-mono text-lg font-black text-ink-900 sm:text-xl" dir="ltr">
          {order.orderNumber}
        </h1>
        <OrderStatusBadge status={order.status} />
      </div>
      <p className="-mt-4 mb-6 text-xs text-ink-800/40">ثبت‌شده در {formatDate(order.createdAt)}</p>

      {order.status === 'pending_payment' && (
        <div className="mb-6 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          <Clock className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            پرداخت این سفارش تکمیل نشده است. سفارش‌های پرداخت‌نشده بعد از ۲۴ ساعت به‌صورت خودکار
            حذف می‌شوند. برای خرید، دوباره از سبد خرید اقدام کنید.
          </p>
        </div>
      )}

      <div className="mb-6 overflow-x-auto">
        <div className="min-w-[420px]">
          <OrderStatusFlow status={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-ink-800/10 bg-white p-4 sm:p-5 lg:col-span-2"
        >
          <h2 className="mb-4 text-sm font-bold text-ink-900">اقلام سفارش</h2>
          <div className="flex flex-col divide-y divide-ink-800/5">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-ink-900">{item.name}</p>
                  {item.variantLabel && (
                    <p className="truncate text-xs text-ink-800/40">{item.variantLabel}</p>
                  )}
                  <p className="mt-0.5 text-xs text-ink-800/50">
                    {item.quantity.toLocaleString('fa-IR')} عدد × {formatPrice(item.price)}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-bold text-ink-900">
                  {formatPrice(item.lineTotal)}
                </p>
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

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex flex-col gap-6"
        >
          <div className="rounded-xl border border-ink-800/10 bg-white p-4 sm:p-5">
            <h2 className="mb-3 text-sm font-bold text-ink-900">آدرس تحویل</h2>
            <div className="space-y-1 text-sm text-ink-800/60">
              <p className="font-bold text-ink-800">{order.shippingAddress.fullName}</p>
              <p dir="ltr" className="text-left">{order.shippingAddress.phone}</p>
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
        </motion.div>
      </div>
    </div>
  );
}