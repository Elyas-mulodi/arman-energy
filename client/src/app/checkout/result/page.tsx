'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useOrder } from '@/hooks/useOrder';
import { resultConfigs, PaymentStatus } from '@/components/checkout/ResultStates';
import { formatPrice } from '@/lib/utils';

function ResultSkeleton() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
    </div>
  );
}

function CheckoutResultContent() {
  const searchParams = useSearchParams();
  const statusParam = searchParams.get('status');
  const orderNumber = searchParams.get('order');

  // اگه status پارامتری بود که ما نمی‌شناسیم (مثلا دستکاری URL)، به حالت error بیفت
  const isKnownStatus = (value: string | null): value is PaymentStatus =>
    !!value && value in resultConfigs;

  const status: PaymentStatus = isKnownStatus(statusParam) ? statusParam : 'error';
  const config = resultConfigs[status];

  const { order, status: orderFetchStatus } = useOrder(status === 'success' ? orderNumber : null);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 22 }}
        className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full ${config.iconBg} ${config.iconColor}`}
      >
        <config.icon className="h-9 w-9" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-2 text-xl font-black text-ink-900"
      >
        {config.title}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="mb-8 text-sm leading-6 text-ink-800/50"
      >
        {config.description}
      </motion.p>

      {/* جزئیات سفارش - فقط وقتی پرداخت موفق بوده و اطلاعات سفارش لود شده */}
      {status === 'success' && orderFetchStatus === 'success' && order && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8 w-full rounded-xl border border-ink-800/10 bg-white p-5 text-right"
        >
          <div className="mb-3 flex items-center justify-between border-b border-ink-800/10 pb-3">
            <span className="text-xs text-ink-800/40">شماره سفارش</span>
            <span className="font-mono text-sm font-bold text-ink-900" dir="ltr">
              {order.orderNumber}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-800/40">مبلغ پرداخت‌شده</span>
            <span className="text-sm font-bold text-brand-600">
              {formatPrice(order.totalAmount)}
            </span>
          </div>
        </motion.div>
      )}

      {orderNumber && status !== 'success' && (
        <p className="mb-6 font-mono text-xs text-ink-800/40" dir="ltr">
          شماره پیگیری: {orderNumber}
        </p>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        {status === 'success' ? (
          <Link
            href="/profile/orders"
            className="rounded-md bg-brand-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600"
          >
            مشاهده سفارشات من
          </Link>
        ) : (
          <Link
            href="/checkout"
            className="rounded-md bg-brand-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600"
          >
            تلاش مجدد
          </Link>
        )}
        <Link
          href="/products"
          className="flex items-center justify-center gap-1.5 rounded-md border border-ink-800/15 px-6 py-2.5 text-sm font-bold text-ink-800/70 transition hover:bg-ink-800/5"
        >
          ادامه خرید
          <ArrowLeft className="h-3.5 w-3.5" />
        </Link>
      </motion.div>
    </div>
  );
}

export default function CheckoutResultPage() {
  return (
    <Suspense fallback={<ResultSkeleton />}>
      <CheckoutResultContent />
    </Suspense>
  );
}