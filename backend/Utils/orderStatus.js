export const ALL_STATUSES = [
  'pending_payment',
  'paid',
  'failed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

// سفارش‌هایی که پولشان دریافت شده؛ تا وقتی لغو نشده‌اند جزو درآمد حساب می‌شوند
export const PAID_STATUSES = ['paid', 'processing', 'shipped', 'delivered'];

// وضعیت‌هایی که موجودی انبارشان کم شده و اگر لغو شوند باید برگردد
export const STOCK_RESERVED_STATUSES = ['paid', 'processing'];

// مسیر مجاز تغییر وضعیت توسط ادمین
export const ORDER_TRANSITIONS = {
  pending_payment: [],
  failed: [],
  paid: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};