import Link from 'next/link';
import { OrderStatus } from '@/types/order';
import { ORDER_STATUS_MAP } from '@/lib/orderStatus';

const DISPLAY_ORDER: OrderStatus[] = [
  'paid',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'failed',
  'pending_payment',
];

export default function OrderStatusBreakdown({
  breakdown,
}: {
  breakdown: Record<OrderStatus, number>;
}) {
  const max = Math.max(...DISPLAY_ORDER.map((s) => breakdown[s] || 0), 1);
  const total = DISPLAY_ORDER.reduce((sum, s) => sum + (breakdown[s] || 0), 0);

  return (
    <div>
      <p className="mb-4 text-xs text-ink-800/40">
        مجموع {total.toLocaleString('fa-IR')} سفارش
      </p>

      <div className="flex flex-col gap-1">
        {DISPLAY_ORDER.map((status) => {
          const count = breakdown[status] || 0;
          const config = ORDER_STATUS_MAP[status];

          return (
            <Link
              key={status}
              href={`/admin/orders?status=${status}`}
              className="group rounded-md px-2 py-2 transition hover:bg-ink-100/70"
            >
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-bold text-ink-800/80">
                  <span className={`h-2 w-2 rounded-full ${config.dot}`} />
                  {config.label}
                </span>
                <span className="font-black text-ink-900">{count.toLocaleString('fa-IR')}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-ink-800/5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${config.dot}`}
                  style={{ width: `${(count / max) * 100}%` }}
                />
              </div>
            </Link>
          );
        })}
      </div>

      <p className="mt-4 text-[11px] leading-5 text-ink-800/35">
        سفارش‌های «در انتظار پرداخت» بعد از ۲۴ ساعت خودکار حذف می‌شوند.
      </p>
    </div>
  );
}