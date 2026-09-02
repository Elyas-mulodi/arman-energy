'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PackageX, AlertTriangle, ChevronLeft } from 'lucide-react';
import { Order } from '@/types/order';
import { getMyOrders } from '@/lib/orders';
import { formatPrice } from '@/lib/utils';
import OrderStatusBadge from './OrderStatusBadge';
import EmptyState from '@/components/ui/EmptyState';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
}

function OrderRowSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-md border border-ink-800/10 p-4">
      <div className="space-y-2">
        <div className="h-3.5 w-32 animate-pulse rounded bg-ink-100" />
        <div className="h-3 w-48 animate-pulse rounded bg-ink-100" />
      </div>
      <div className="h-5 w-20 animate-pulse rounded bg-ink-100" />
    </div>
  );
}

export default function OrderHistoryList() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch(() => setHasError(true));
  }, []);

  if (hasError) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="خطا در دریافت سفارشات"
        description="لطفا صفحه را رفرش کنید"
      />
    );
  }

  if (!orders) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <OrderRowSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={PackageX}
        title="هنوز سفارشی ثبت نکرده‌اید"
        description="محصولات ما رو ببین و اولین سفارشت رو ثبت کن"
      />
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order, index) => (
        <motion.div
          key={order._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.04 }}
        >
  
            <div className="min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-bold text-ink-900" dir="ltr">
                  {order.orderNumber}
                </span>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="text-xs text-ink-800/45">
                {formatDate(order.createdAt)} · {order.items.length.toLocaleString('fa-IR')} قلم کالا
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-left sm:text-right">
                <span className="text-base font-black text-ink-900">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
              <ChevronLeft className="h-4 w-4 shrink-0 text-ink-800/25 transition group-hover:text-brand-500" />
            </div>
        </motion.div>
      ))}
    </div>
  );
}