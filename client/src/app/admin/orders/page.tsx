'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { ShoppingBag, Loader2, Eye, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Order, OrderStatus } from '@/types/order';
import { getAllOrdersAdmin } from '@/lib/orders';
import { ORDER_STATUS_MAP } from '@/lib/orderStatus';
import { formatPrice } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import Pagination from '@/components/ui/Pagination';

const PAGE_SIZE = 15;

const FILTER_STATUSES: OrderStatus[] = [
  'paid',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'failed',
  'pending_payment',
];

const statusFilters: { label: string; value: OrderStatus | '' }[] = [
  { label: 'همه', value: '' },
  ...FILTER_STATUSES.map((s) => ({ label: ORDER_STATUS_MAP[s].label, value: s })),
];

const isOrderStatus = (value: string | null): value is OrderStatus =>
  !!value && value in ORDER_STATUS_MAP;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function AdminOrdersContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // فیلتر وضعیت از روی URL خوانده میشود (لینک داشبورد و سایدبار درست کار می‌کنند)
  const rawStatus = searchParams.get('status');
  const statusFilter: OrderStatus | '' = isOrderStatus(rawStatus) ? rawStatus : '';

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, debouncedSearch]);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setIsLoading(true);
      try {
        const data = await getAllOrdersAdmin(
          {
            page: currentPage,
            limit: PAGE_SIZE,
            ...(statusFilter && { status: statusFilter }),
            ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
          },
          controller.signal
        );
        setOrders(data.orders);
        setTotal(data.pagination.total);
        setTotalPages(data.pagination.pages || 1);
        setIsLoading(false);
      } catch (error) {
        if (axios.isCancel(error)) return;
        toast.error('خطا در دریافت سفارشات');
        setIsLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [currentPage, statusFilter, debouncedSearch]);

  const handleFilterChange = (value: OrderStatus | '') => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set('status', value);
    else params.delete('status');
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-ink-900 sm:text-2xl">سفارشات</h1>
          {!isLoading && (
            <p className="mt-0.5 text-xs text-ink-800/40">
              {total.toLocaleString('fa-IR')} سفارش یافت شد
            </p>
          )}
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-800/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="شماره سفارش، نام یا موبایل..."
            className="w-full rounded-md border border-ink-800/15 bg-white py-2 pr-9 pl-8 text-sm outline-none focus:border-brand-500"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-800/30 hover:text-ink-800/60"
              aria-label="پاک کردن جستجو"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {statusFilters.map((filter) => (
          <button
            key={filter.value || 'all'}
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
          {/* موبایل: کارت */}
          <div className="flex flex-col gap-3 sm:hidden">
            {orders.map((order) => {
              const customerName =
                typeof order.user === 'string' ? order.shippingAddress.fullName : order.user.fullName;
              return (
                <Link
                  key={order._id}
                  href={`/admin/orders/${order.orderNumber}`}
                  className="block rounded-xl border border-ink-800/10 bg-white p-4"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
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

          {/* دسکتاپ: جدول */}
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
                    const customer = typeof order.user === 'string' ? null : order.user;
                    return (
                      <tr
                        key={order._id}
                        className="border-b border-ink-800/5 transition last:border-0 hover:bg-ink-100/40"
                      >
                        <td className="whitespace-nowrap px-4 py-3">
                          <span className="font-mono text-xs font-bold text-ink-900" dir="ltr">
                            {order.orderNumber}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <p className="text-ink-800/80">
                            {customer?.fullName ?? order.shippingAddress.fullName}
                          </p>
                          <p className="text-[11px] text-ink-800/40" dir="ltr">
                            {customer?.phone ?? order.shippingAddress.phone}
                          </p>
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
                            aria-label="مشاهده جزئیات"
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

          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
        </div>
      }
    >
      <AdminOrdersContent />
    </Suspense>
  );
}