'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ShoppingBag, Loader2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { Order, OrderStatus } from '@/types/order';
import { getAllOrdersAdmin } from '@/lib/orders';
import { ORDER_STATUS_MAP } from '@/lib/orderStatus';
import { formatPrice } from '@/lib/utils';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import Pagination from '@/components/ui/Pagination';

const PAGE_SIZE = 15;

const statusFilters: { label: string; value: OrderStatus | '' }[] = [
  { label: 'همه', value: '' },
  { label: 'پرداخت‌شده', value: 'paid' },
  { label: 'در حال پردازش', value: 'processing' },
  { label: 'ارسال‌شده', value: 'shipped' },
  { label: 'تحویل‌شده', value: 'delivered' },
  { label: 'لغوشده', value: 'cancelled' },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllOrdersAdmin({
        page: currentPage,
        limit: PAGE_SIZE,
        ...(statusFilter && { status: statusFilter }),
      });
      setOrders(data.orders);
      setTotalPages(data.pagination.pages || 1);
    } catch {
      toast.error('خطا در دریافت سفارشات');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // با تغییر فیلتر، برگرد به صفحه اول
  const handleFilterChange = (value: OrderStatus | '') => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-black text-ink-900">سفارشات</h1>

      <div className="mb-5 flex flex-wrap gap-2">
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => handleFilterChange(filter.value)}
            className={`rounded-md px-3.5 py-2 text-xs font-bold transition ${
              statusFilter === filter.value
                ? 'bg-brand-500 text-white'
                : 'bg-white text-ink-800/60 hover:bg-ink-800/5'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-ink-800/10 bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ShoppingBag className="mb-3 h-8 w-8 text-ink-800/20" />
            <p className="text-sm text-ink-800/40">سفارشی یافت نشد</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-800/10 bg-ink-100/50 text-right text-xs text-ink-800/50">
                <th className="px-4 py-3 font-bold">شماره سفارش</th>
                <th className="px-4 py-3 font-bold">مشتری</th>
                <th className="px-4 py-3 font-bold">تاریخ</th>
                <th className="px-4 py-3 font-bold">مبلغ</th>
                <th className="px-4 py-3 font-bold">وضعیت</th>
                <th className="px-4 py-3 font-bold">جزئیات</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const customerName =
                  typeof order.user === 'string' ? '—' : order.user.fullName;

                return (
                  <tr key={order._id} className="border-b border-ink-800/5 last:border-0">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-bold text-ink-900" dir="ltr">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-800/70">{customerName}</td>
                    <td className="px-4 py-3 text-ink-800/50">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3 font-bold text-ink-900">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-ink-800/50 hover:bg-ink-800/5 hover:text-brand-600"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {!isLoading && orders.length > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}