import { OrderStatus } from '@/types/order';

interface OrderStatusConfig {
  label: string;
  className: string; // رنگ بج
  dot: string; // رنگ نقطه/نوار
}

export const ORDER_STATUS_MAP: Record<OrderStatus, OrderStatusConfig> = {
  pending_payment: { label: 'در انتظار پرداخت', className: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  paid: { label: 'پرداخت‌شده', className: 'bg-blue-50 text-blue-700', dot: 'bg-blue-500' },
  failed: { label: 'ناموفق', className: 'bg-red-50 text-red-600', dot: 'bg-red-500' },
  processing: { label: 'در حال پردازش', className: 'bg-sky-50 text-sky-700', dot: 'bg-sky-500' },
  shipped: { label: 'ارسال‌شده', className: 'bg-purple-50 text-purple-700', dot: 'bg-purple-500' },
  delivered: { label: 'تحویل‌شده', className: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  cancelled: { label: 'لغوشده', className: 'bg-slate-100 text-slate-500', dot: 'bg-slate-400' },
};

export const FALLBACK_STATUS: OrderStatusConfig = {
  label: 'نامشخص',
  className: 'bg-slate-100 text-slate-500',
  dot: 'bg-slate-400',
};

// دقیقا منطبق با ORDER_TRANSITIONS بک‌اند
export const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending_payment: [],
  failed: [],
  paid: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

export const STATUS_ACTION_LABEL: Partial<Record<OrderStatus, string>> = {
  processing: 'شروع پردازش',
  shipped: 'ثبت ارسال',
  delivered: 'ثبت تحویل',
  cancelled: 'لغو سفارش',
};

export const FINAL_STATUS_MESSAGE: Partial<Record<OrderStatus, string>> = {
  pending_payment: 'این سفارش هنوز پرداخت نشده است',
  failed: 'پرداخت این سفارش ناموفق بوده است',
  delivered: 'این سفارش تکمیل شده است',
  cancelled: 'این سفارش لغو شده است',
};