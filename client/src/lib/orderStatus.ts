import { OrderStatus } from '@/types/order';

export const ORDER_STATUS_MAP: Record<OrderStatus, { label: string; className: string }> = {
  pending_payment: { label: 'در انتظار پرداخت', className: 'bg-ink-800/10 text-ink-800/60' },
  paid: { label: 'پرداخت شده', className: 'bg-blue-500/10 text-blue-600' },
  processing: { label: 'در حال پردازش', className: 'bg-amber-500/10 text-amber-600' },
  shipped: { label: 'ارسال شده', className: 'bg-brand-500/10 text-brand-600' },
  delivered: { label: 'تحویل داده شده', className: 'bg-emerald-500/10 text-emerald-600' },
  cancelled: { label: 'لغو شده', className: 'bg-red-500/10 text-red-600' },
  failed: { label: 'ناموفق', className: 'bg-red-500/10 text-red-600' },
};