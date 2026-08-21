'use client';

import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { AvailableCartItem, UnavailableCartItem } from '@/types/cart';
import CartItemRow from '@/components/cart/CartItemRow';
import UnavailableItemRow from '@/components/cart/UnavailableItemRow';
import CartSummary from '@/components/cart/CartSummary';
import EmptyCart from '@/components/cart/EmptyCart';
import CartSkeleton from '@/components/cart/CartSkeleton';

export default function CartPage() {
  const authInitialized = useAuthStore((s) => s.isInitialized);
  const user = useAuthStore((s) => s.user);

  const { items, subtotal, isLoading, isInitialized, fetchCart } = useCartStore();

  useEffect(() => {
    if (authInitialized && user) {
      fetchCart();
    }
  }, [authInitialized, user, fetchCart]);

  const availableItems = items.filter((i): i is AvailableCartItem => i.available);
  const unavailableItems = items.filter((i): i is UnavailableCartItem => !i.available);

  if (!authInitialized || (user && !isInitialized) || isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-xl font-black text-ink-900">سبد خرید</h1>
        <CartSkeleton />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-xl font-black text-ink-900">سبد خرید</h1>
        <EmptyCart />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-xl font-black text-ink-900">سبد خرید</h1>
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-xl font-black text-ink-900">
        سبد خرید <span className="text-ink-800/40">({items.length.toLocaleString('fa-IR')})</span>
      </h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <div className="rounded-md border border-ink-800/10 bg-white px-5">
          <AnimatePresence initial={false}>
            {unavailableItems.map((item) => (
              <UnavailableItemRow key={item._id} item={item} />
            ))}
            {availableItems.map((item) => (
              <CartItemRow key={item._id} item={item} />
            ))}
          </AnimatePresence>
        </div>

        {availableItems.length > 0 && (
          <div className="lg:sticky lg:top-20 lg:self-start">
            <CartSummary items={availableItems} subtotal={subtotal} />
          </div>
        )}
      </div>
    </div>
  );
}