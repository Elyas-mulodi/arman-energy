'use client';

import { useState } from 'react';
import { Loader2, ArrowLeft, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { OrderStatus } from '@/types/order';
import {
  ORDER_STATUS_MAP,
  ORDER_TRANSITIONS,
  STATUS_ACTION_LABEL,
  FINAL_STATUS_MESSAGE,
} from '@/lib/orderStatus';
import { updateOrderStatusAdmin } from '@/lib/orders';
import { getErrorMessage } from '@/store/useAuthStore';

interface OrderStatusUpdaterProps {
  orderId: string;
  currentStatus: OrderStatus;
  onUpdated: (newStatus: OrderStatus) => void;
}

export default function OrderStatusUpdater({
  orderId,
  currentStatus,
  onUpdated,
}: OrderStatusUpdaterProps) {
  const [pending, setPending] = useState<OrderStatus | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const nextStatuses = ORDER_TRANSITIONS[currentStatus] ?? [];
  const primaryNext = nextStatuses.find((s) => s !== 'cancelled');
  const canCancel = nextStatuses.includes('cancelled');
  const isBusy = pending !== null;

  const changeStatus = async (status: OrderStatus) => {
    setPending(status);
    try {
      await updateOrderStatusAdmin(orderId, status);
      onUpdated(status);
      toast.success(`وضعیت سفارش: ${ORDER_STATUS_MAP[status].label}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setPending(null);
      setConfirmCancel(false);
    }
  };

  if (nextStatuses.length === 0) {
    return (
      <p className="rounded-md bg-ink-800/5 px-3 py-2 text-xs font-bold text-ink-800/50">
        {FINAL_STATUS_MESSAGE[currentStatus] ?? 'وضعیت این سفارش قابل تغییر نیست'}
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {primaryNext && (
        <button
          onClick={() => changeStatus(primaryNext)}
          disabled={isBusy}
          className="flex items-center gap-2 rounded-md bg-brand-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600 disabled:opacity-60"
        >
          {pending === primaryNext ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowLeft className="h-4 w-4" />
          )}
          {STATUS_ACTION_LABEL[primaryNext]}
        </button>
      )}

      {canCancel && (
        <button
          onClick={() => (confirmCancel ? changeStatus('cancelled') : setConfirmCancel(true))}
          onBlur={() => setConfirmCancel(false)}
          disabled={isBusy}
          className={`flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-bold transition disabled:opacity-60 ${
            confirmCancel
              ? 'border-red-500 bg-red-500 text-white'
              : 'border-red-500/25 text-red-500 hover:bg-red-50'
          }`}
        >
          {pending === 'cancelled' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          {confirmCancel ? 'مطمئنی؟ موجودی برمی‌گردد' : STATUS_ACTION_LABEL.cancelled}
        </button>
      )}
    </div>
  );
}