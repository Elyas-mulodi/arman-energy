'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ShoppingBag, Loader2, Eye, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { Order, OrderStatus } from '@/types/order';
import { getAllOrdersAdmin } from '@/lib/orders';
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

  const handleFilterChange = (value: OrderStatus | '') => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  return (
    <div>
      <h1 className="mb-6 text-xl font-black text-ink-900 sm:text-2xl">سفارشات</h1>

      {/* فیلترها - قابل اسکرول افقی روی موبایل به‌جای شکستن ناقص */}
      <div className="mb-5 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => handleFilterChange(filter.value)}
            className={`shrink-0 rounded-md px-3.5 py-2 text-xs font-bold transition ${
              statusFilter === filter.value
                ? 'bg-brand-500 text-white'
                : 'bg-white text-ink-800/60 hover:bg-ink-800/5'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center rounded-xl border border-ink-800/10 bg-white py-16">
          <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-ink-800/10 bg-white py-16 text-center">
          <ShoppingBag className="mb-3 h-8 w-8 text-ink-800/20" />
          <p className="text-sm text-ink-800/40">سفارشی یافت نشد</p>
        </div>
      ) : (
        <>
          {/* نسخه‌ی کارتی - فقط موبایل */}
          <div className="flex flex-col gap-3 sm:hidden">
            {orders.map((order) => {
              const customerName = typeof order.user === 'string' ? '—' : order.user.fullName;
              return (
                <Link
                  key={order._id}
                  href={`/admin/orders/${order.orderNumber}`}
                  className="block rounded-xl border border-ink-800/10 bg-white p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-ink-900" dir="ltr">
                      {order.orderNumber}
                    </span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="mb-1 text-sm text-ink-800/70">{customerName}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-ink-800/40">{formatDate(order.createdAt)}</span>
                    <span className="text-sm font-bold text-ink-900">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* نسخه‌ی جدولی - از sm به بالا */}
          <div className="hidden overflow-hidden rounded-xl border border-ink-800/10 bg-white sm:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink-800/10 bg-ink-100/50 text-right text-xs text-ink-800/50">
                    <th className="whitespace-nowrap px-4 py-3 font-bold">شماره سفارش</th>
                    <th className="whitespace-nowrap px-4 py-3 font-bold">مشتری</th>
                    <th className="whitespace-nowrap px-4 py-3 font-bold">تاریخ</th>
                    <th className="whitespace-nowrap px-4 py-3 font-bold">مبلغ</th>
                    <th className="whitespace-nowrap px-4 py-3 font-bold">وضعیت</th>
                    <th className="whitespace-nowrap px-4 py-3 font-bold">جزئیات</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const customerName =
                      typeof order.user === 'string' ? '—' : order.user.fullName;

                    return (
                      <tr key={order._id} className="border-b border-ink-800/5 last:border-0">
                        <td className="whitespace-nowrap px-4 py-3">
                          <span className="font-mono text-xs font-bold text-ink-900" dir="ltr">
                            {order.orderNumber}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-ink-800/70">
                          {customerName}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-ink-800/50">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-bold text-ink-900">
                          {formatPrice(order.totalAmount)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <OrderStatusBadge status={order.status} />
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <Link
                            href={`/admin/orders/${order.orderNumber}`}
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
            </div>
          </div>
        </>
      )}

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