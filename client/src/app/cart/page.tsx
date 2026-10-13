'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore, getErrorMessage } from '@/store/useAuthStore';
import { formatPrice } from '@/lib/utils';
import CartItemRow from '@/components/cart/CartItemRow';
import EmptyState from '@/components/ui/EmptyState';

export default function CartPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  const { items, subtotal, isLoading, fetchCart, updateQuantity, removeItem } = useCartStore();
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (!isInitialized) return;

    if (!user) {
      router.replace('/login?redirect=/cart');
      return;
    }
    fetchCart();
  }, [isInitialized, user, fetchCart, router]);

  const handleQuantityChange = async (itemId: string, quantity: number) => {
    setBusyId(itemId);
    try {
      await updateQuantity(itemId, quantity);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  const handleRemove = async (itemId: string) => {
    setBusyId(itemId);
    try {
      await removeItem(itemId);
      toast.success('از سبد خرید حذف شد');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  if (!isInitialized || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
      </div>
    );
  }

  if (isLoading && items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_340px]">
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-lg bg-ink-800/5" />
            ))}
          </div>
          <div className="h-56 animate-pulse rounded-xl bg-ink-800/5" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="سبد خرید شما خالی است"
          description="محصولات ما رو ببین و اولین مورد رو به سبد اضافه کن"
        />
        <div className="mt-6 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 rounded-md bg-brand-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600"
          >
            مشاهده محصولات
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  // اگه آیتم ناموجود یا با موجودی ناکافی داریم، اجازه‌ی ادامه ندیم
  const hasProblem = items.some(
    (item) => !item.available || Boolean(item.stockWarning)
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-black text-ink-900">سبد خرید</h1>

      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.25 }}
              >
                <CartItemRow
                  item={item}
                  isBusy={busyId === item._id}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemove}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="rounded-xl border border-ink-800/10 bg-white p-5 md:sticky md:top-24">
          <h2 className="mb-4 text-sm font-bold text-ink-900">خلاصه سفارش</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-ink-800/60">
              <span>جمع کالاها</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink-800/60">
              <span>هزینه ارسال</span>
              <span>رایگان</span>
            </div>
            <div className="flex justify-between border-t border-ink-800/10 pt-3 text-base font-black text-ink-900">
              <span>مبلغ قابل پرداخت</span>
              <span className="text-brand-600">{formatPrice(subtotal)}</span>
            </div>
          </div>

          {hasProblem && (
            <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-xs font-bold text-amber-600">
              برخی کالاها ناموجودند یا موجودی کافی ندارند. لطفا قبل از ادامه، سبد را اصلاح کنید.
            </p>
          )}

          <Link
            href="/checkout"
            aria-disabled={hasProblem}
            onClick={(e) => hasProblem && e.preventDefault()}
            className={`mt-4 flex w-full items-center justify-center gap-2 rounded-md py-3 text-sm font-bold text-white transition ${
              hasProblem
                ? 'cursor-not-allowed bg-ink-800/20'
                : 'bg-brand-500 hover:bg-brand-600'
            }`}
          >
            ادامه و تکمیل خرید
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}