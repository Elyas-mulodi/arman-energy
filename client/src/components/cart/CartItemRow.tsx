'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { X, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { AvailableCartItem } from '@/types/cart';
import { useCartStore } from '@/store/useCartStore';
import QuantityStepper from './QuantityStepper';

function formatPrice(n: number) {
  return n.toLocaleString('fa-IR');
}

export default function CartItemRow({ item }: { item: AvailableCartItem }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const variantLabel = [item.variant.voltage, item.variant.size, item.variant.brand]
    .filter(Boolean)
    .join(' - ');
  const hasDiscount = item.variant.discountPrice && item.variant.discountPrice < item.variant.price;
  const unitPrice = item.variant.discountPrice || item.variant.price;

  const handleQuantityChange = async (next: number) => {
    if (next < 1 || next > item.variant.stock) return;
    setIsUpdating(true);
    try {
      await updateQuantity(item._id, next);
    } catch {
      toast.error('خطا در به‌روزرسانی تعداد');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await removeItem(item._id);
    } catch {
      toast.error('خطا در حذف آیتم');
      setIsRemoving(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
      transition={{ duration: 0.25 }}
      className="flex gap-4 border-b border-ink-800/8 py-5 last:border-0"
    >
      <Link
        href={`/products/${item.product.slug}`}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-ink-800/10 bg-ink-100"
      >
        {item.product.image ? (
          <Image src={item.product.image} alt={item.product.name} fill sizes="80px" className="object-cover" />
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link
              href={`/products/${item.product.slug}`}
              className="text-sm font-bold text-ink-900 transition hover:text-brand-600"
            >
              {item.product.name}
            </Link>
            {variantLabel && <p className="mt-0.5 text-xs text-ink-800/45">{variantLabel}</p>}
          </div>

          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-ink-800/30 transition hover:bg-red-500/10 hover:text-red-500 disabled:opacity-40"
            aria-label="حذف از سبد"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {item.stockWarning && (
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-600">
            <AlertTriangle className="h-3 w-3" />
            {item.stockWarning}
          </div>
        )}

        <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
          <QuantityStepper
            quantity={item.quantity}
            max={item.variant.stock}
            disabled={isUpdating}
            onChange={handleQuantityChange}
          />

          <div className="text-left">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-black text-ink-900">{formatPrice(item.lineTotal)}</span>
              <span className="text-[10px] text-ink-800/45">تومان</span>
            </div>
            {hasDiscount && (
              <p className="text-[11px] text-ink-800/35 line-through">
                {formatPrice(item.variant.price * item.quantity)}
              </p>
            )}
            {item.quantity > 1 && (
              <p className="text-[10px] text-ink-800/35">
                {formatPrice(unitPrice)} × {item.quantity.toLocaleString('fa-IR')}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}