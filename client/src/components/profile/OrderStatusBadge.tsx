import { OrderStatus } from '@/types/order';
import { ORDER_STATUS_MAP } from '@/lib/orderStatus';

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, className } = ORDER_STATUS_MAP[status];
  return (
    <span className={`whitespace-nowrap rounded px-2 py-1 text-[11px] font-bold ${className}`}>
      {label}
    </span>
  );
}