'use client';

import { motion } from 'framer-motion';
import { Check, CreditCard, PackageCheck, Truck, Home, XCircle } from 'lucide-react';
import { OrderStatus } from '@/types/order';

interface FlowStep {
  status: OrderStatus;
  label: string;
  icon: typeof CreditCard;
}

const mainFlow: FlowStep[] = [
  { status: 'paid', label: 'پرداخت شده', icon: CreditCard },
  { status: 'processing', label: 'در حال پردازش', icon: PackageCheck },
  { status: 'shipped', label: 'ارسال شده', icon: Truck },
  { status: 'delivered', label: 'تحویل شده', icon: Home },
];

export default function OrderStatusFlow({ status }: { status: OrderStatus }) {
  // حالت‌های خارج از مسیر عادی (لغو یا ناموفق) جدا و با رنگ متفاوت نمایش داده میشن
  const isTerminalError = status === 'cancelled' || status === 'failed';
  const isPending = status === 'pending_payment';

  const currentIndex = mainFlow.findIndex((step) => step.status === status);

  if (isPending) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
        <CreditCard className="h-4 w-4" />
        در انتظار تکمیل پرداخت توسط مشتری
      </div>
    );
  }

  if (isTerminalError) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
        <XCircle className="h-4 w-4" />
        {status === 'cancelled' ? 'این سفارش لغو شده است' : 'پرداخت این سفارش ناموفق بوده است'}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-ink-800/10 bg-white p-6">
      <div className="relative flex items-start justify-between">
        {/* خط اتصال پس‌زمینه */}
        <div className="absolute right-0 top-5 h-0.5 w-full bg-ink-800/10" />
        {/* خط اتصال پیشرفت - عرضش بر اساس مرحله‌ی فعلی محاسبه میشه */}
        <motion.div
          initial={{ width: 0 }}
          animate={{
            width: currentIndex >= 0 ? `${(currentIndex / (mainFlow.length - 1)) * 100}%` : 0,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute right-0 top-5 h-0.5 bg-brand-500"
        />

        {mainFlow.map((step, index) => {
          const isCompleted = currentIndex > index;
          const isCurrent = currentIndex === index;
          const isFuture = currentIndex < index;

          return (
            <div key={step.status} className="relative z-10 flex flex-1 flex-col items-center gap-2">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.08 }}
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                  isCompleted
                    ? 'border-brand-500 bg-brand-500 text-white'
                    : isCurrent
                      ? 'border-brand-500 bg-white text-brand-500'
                      : 'border-ink-800/15 bg-white text-ink-800/25'
                }`}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <step.icon className="h-4 w-4" />
                )}

                {/* پالس دور مرحله‌ی فعلی */}
                {isCurrent && (
                  <span className="absolute inset-0 animate-ping rounded-full bg-brand-500/30" />
                )}
              </motion.div>

              <span
                className={`text-center text-[11px] font-bold ${
                  isFuture ? 'text-ink-800/30' : 'text-ink-800/80'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}