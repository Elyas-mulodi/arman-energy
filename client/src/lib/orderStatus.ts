import { OrderStatus } from '@/types/order';

interface OrderStatusConfig {
  label: string;
  className: string;
}

export const ORDER_STATUS_MAP: Record<OrderStatus, OrderStatusConfig> = {
  pending_payment: { label: 'در انتظار پرداخت', className: 'bg-amber-50 text-amber-600' },
  paid: { label: 'پرداخت‌شده', className: 'bg-blue-50 text-blue-600' },
  failed: { label: 'ناموفق', className: 'bg-red-50 text-red-500' },
  processing: { label: 'در حال پردازش', className: 'bg-brand-50 text-brand-600' },
  shipped: { label: 'ارسال‌شده', className: 'bg-purple-50 text-purple-600' },
  delivered: { label: 'تحویل‌شده', className: 'bg-emerald-50 text-emerald-600' },
  cancelled: { label: 'لغوشده', className: 'bg-ink-800/5 text-ink-800/40' },
};

export const ADMIN_EDITABLE_STATUSES: OrderStatus[] = [
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];