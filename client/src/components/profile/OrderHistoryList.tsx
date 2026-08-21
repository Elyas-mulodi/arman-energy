'use client';

import { useEffect, useState } from 'react';
import { PackageX } from 'lucide-react';
import { Order } from '@/types/order';
import { getMyOrders } from '@/lib/orders';
import OrderStatusBadge from './OrderStatusBadge';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
}

function OrderRowSkeleton() {
  return (
    <div className="animate-pulse rounded-md border border-ink-800/10 p-4">
      <div className="mb-2 h-3.5 w-32 rounded bg-ink-100" />
      <div className="h-3 w-48 rounded bg-ink-100" />
    </div>
  );
}

export default function OrderHistoryList() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch(() => setError(true));
  }, []);

  if (error) {
    return <p className="py-8 text-center text-sm text-ink-800/40">خطا در دریافت سفارشات</p>;
  }

  if (!orders) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => <OrderRowSkeleton key={i} />)}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex h-56 flex-col items-center justify-center gap-3 rounded-md border border-dashed border-ink-800/15 text-center">
        <PackageX className="h-8 w-8 text-ink-800/25" strokeWidth={1.5} />
        <p className="text-sm text-ink-800/40">هنوز سفارشی ثبت نکرده‌اید</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <div
          key={order._id}
          className="flex flex-col gap-3 rounded-md border border-ink-800/10 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-ink-900" dir="ltr">
                {order.orderNumber}
              </span>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-xs text-ink-800/45">
              {formatDate(order.createdAt)} · {order.items.length.toLocaleString('fa-IR')} قلم کالا
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-base font-black text-ink-900">
              {order.totalAmount.toLocaleString('fa-IR')}
            </span>
            <span className="mr-1 text-[11px] text-ink-800/50">تومان</span>
          </div>
        </div>
      ))}
    </div>
  );
}