import { OrderStatus } from '@/types/order';
import { ORDER_STATUS_MAP, FALLBACK_STATUS } from '@/lib/orderStatus';

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = ORDER_STATUS_MAP[status] ?? FALLBACK_STATUS;

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold ${config.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}