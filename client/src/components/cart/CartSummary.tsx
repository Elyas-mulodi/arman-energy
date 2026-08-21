'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { AvailableCartItem } from '@/types/cart';
import { useCartStore } from '@/store/useCartStore';
import Rivet from '@/components/ui/Rivet';

function formatPrice(n: number) {
  return n.toLocaleString('fa-IR');
}

export default function CartSummary({
  items,
  subtotal,
}: {
  items: AvailableCartItem[];
  subtotal: number;
}) {
  const clearCart = useCartStore((s) => s.clearCart);
  const [confirmingClear, setConfirmingClear] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const originalTotal = items.reduce((sum, i) => sum + i.variant.price * i.quantity, 0);
  const totalSaved = originalTotal - subtotal;
  const hasUnavailable = false; // فقط برای نمایش دکمه چک‌اوت لازمه، حساب نمی‌شه چون این کامپوننت فقط آیتم موجود می‌گیره

  const handleClear = async () => {
    if (!confirmingClear) {
      setConfirmingClear(true);
      return;
    }
    setIsClearing(true);
    try {
      await clearCart();
      toast.success('سبد خرید خالی شد');
    } catch {
      toast.error('خطا در خالی کردن سبد خرید');
    } finally {
      setIsClearing(false);
      setConfirmingClear(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-md border border-ink-800/15 bg-ink-900 p-6">
      <div className="absolute right-3 top-3"><Rivet /></div>
      <div className="absolute left-3 top-3"><Rivet /></div>
      <div className="absolute bottom-3 right-3"><Rivet /></div>
      <div className="absolute bottom-3 left-3"><Rivet /></div>

      <p className="mb-5 font-mono text-[11px] tracking-widest text-brand-500" dir="ltr">
        ORDER SUMMARY
      </p>

      <div className="space-y-3 border-b border-ink-800 pb-5 text-sm">
        <div className="flex justify-between text-ink-100/60">
          <span>جمع کالاها ({items.length.toLocaleString('fa-IR')} قلم)</span>
          <span dir="ltr">{formatPrice(originalTotal)}</span>
        </div>
        {totalSaved > 0 && (
          <div className="flex justify-between text-emerald-500">
            <span>سود شما از خرید</span>
            <span dir="ltr">-{formatPrice(totalSaved)}</span>
          </div>
        )}
        <div className="flex justify-between text-ink-100/60">
          <span>هزینه ارسال</span>
          <span className="text-emerald-500">رایگان</span>
        </div>
      </div>

      <div className="flex items-baseline justify-between py-5">
        <span className="text-sm font-bold text-ink-100/70">مبلغ قابل پرداخت</span>
        <div className="text-left">
          <span className="text-xl font-black text-ink-100">{formatPrice(subtotal)}</span>
          <span className="mr-1 text-[11px] text-ink-100/40">تومان</span>
        </div>
      </div>

      <Link
        href="/checkout"
        className="flex items-center justify-center gap-2 rounded-md bg-brand-500 py-3 text-sm font-bold text-white transition hover:bg-brand-600"
      >
        ادامه فرآیند خرید
        <ArrowLeft className="h-4 w-4" />
      </Link>

      <button
        onClick={handleClear}
        disabled={isClearing}
        onBlur={() => setConfirmingClear(false)}
        className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border py-2.5 text-xs font-bold transition disabled:opacity-50 ${
          confirmingClear
            ? 'border-red-500/40 bg-red-500/10 text-red-400'
            : 'border-ink-800 text-ink-100/40 hover:text-ink-100/70'
        }`}
      >
        <Trash2 className="h-3.5 w-3.5" />
        {confirmingClear ? 'مطمئنی؟ دوباره بزن' : 'خالی کردن سبد خرید'}
      </button>
    </div>
  );
}