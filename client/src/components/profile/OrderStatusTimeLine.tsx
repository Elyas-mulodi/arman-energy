import { Check, Clock, CreditCard, Package, Truck, Home, XCircle, AlertTriangle } from 'lucide-react';
import { OrderStatus } from '@/types/order';

const steps = [
  { key: 'paid', label: 'پرداخت شد', icon: CreditCard },
  { key: 'processing', label: 'در حال پردازش', icon: Package },
  { key: 'shipped', label: 'ارسال شد', icon: Truck },
  { key: 'delivered', label: 'تحویل داده شد', icon: Home },
] as const;

const stepOrder: Record<string, number> = {
  paid: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
};

export default function OrderStatusTimeline({ status }: { status: OrderStatus }) {
  // وضعیت‌هایی که تو مسیر خطی «در حال انجام» قرار نمی‌گیرن، جداگانه نمایش داده می‌شن
  if (status === 'pending_payment') {
    return (
      <div className="flex items-center gap-3 rounded-md border border-amber-500/20 bg-amber-500/5 p-4">
        <Clock className="h-5 w-5 shrink-0 text-amber-500" />
        <p className="text-sm font-medium text-amber-700">
          این سفارش هنوز پرداخت نشده است
        </p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="flex items-center gap-3 rounded-md border border-red-500/20 bg-red-500/5 p-4">
        <XCircle className="h-5 w-5 shrink-0 text-red-500" />
        <p className="text-sm font-medium text-red-600">پرداخت این سفارش ناموفق بوده است</p>
      </div>
    );
  }

  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-3 rounded-md border border-ink-800/15 bg-ink-100/50 p-4">
        <AlertTriangle className="h-5 w-5 shrink-0 text-ink-800/40" />
        <p className="text-sm font-medium text-ink-800/60">این سفارش لغو شده است</p>
      </div>
    );
  }

  const currentIndex = stepOrder[status] ?? 0;

  return (
    <div className="flex items-start">
      {steps.map((step, i) => {
        const isDone = i <= currentIndex;
        const isLast = i === steps.length - 1;

        return (
          <div key={step.key} className={`flex ${isLast ? '' : 'flex-1'} items-start`}>
            <div className="flex flex-col items-center">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition ${
                  isDone
                    ? 'border-brand-500 bg-brand-500 text-white'
                    : 'border-ink-800/15 bg-white text-ink-800/30'
                }`}
              >
                {isDone ? <Check className="h-4 w-4" /> : <step.icon className="h-4 w-4" />}
              </span>
              <p
                className={`mt-2 max-w-[70px] text-center text-[11px] font-medium leading-tight ${
                  isDone ? 'text-ink-900' : 'text-ink-800/40'
                }`}
              >
                {step.label}
              </p>
            </div>

            {!isLast && (
              <div
                className={`mt-4 h-0.5 flex-1 transition ${
                  i < currentIndex ? 'bg-brand-500' : 'bg-ink-800/10'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}