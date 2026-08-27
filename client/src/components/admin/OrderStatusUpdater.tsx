'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { OrderStatus } from '@/types/order';
import { ORDER_STATUS_MAP, ADMIN_EDITABLE_STATUSES } from '@/lib/orderStatus';
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
  const [isUpdating, setIsUpdating] = useState(false);

  // اگه سفارش هنوز پرداخت نشده یا ناموفق بوده، اصلاً امکان تغییر وضعیت دستی نداره
  const canEdit = currentStatus !== 'pending_payment' && currentStatus !== 'failed';

  const handleChange = async (newStatus: OrderStatus) => {
    if (newStatus === currentStatus) return;

    setIsUpdating(true);
    try {
      await updateOrderStatusAdmin(orderId, newStatus);
      onUpdated(newStatus);
      toast.success('وضعیت سفارش به‌روزرسانی شد');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsUpdating(false);
    }
  };

  if (!canEdit) {
    return (
      <p className="text-xs text-ink-800/40">
        این سفارش هنوز پرداخت نشده و قابل تغییر وضعیت دستی نیست
      </p>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={currentStatus}
        onChange={(e) => handleChange(e.target.value as OrderStatus)}
        disabled={isUpdating}
        className="rounded-md border border-ink-800/15 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 disabled:opacity-60"
      >
        {/* وضعیت فعلی رو هم نشون بده حتی اگه paid باشه (نه فقط editable ها) */}
        {currentStatus === 'paid' && <option value="paid">پرداخت‌شده</option>}
        {ADMIN_EDITABLE_STATUSES.map((status) => (
          <option key={status} value={status}>
            {ORDER_STATUS_MAP[status].label}
          </option>
        ))}
      </select>
      {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-brand-500" />}
    </div>
  );
}