'use client';

import Link from 'next/link';
import { Minus, Plus, Trash2, Zap, Loader2 } from 'lucide-react';
import { CartItem } from '@/types/cart';
import { formatPrice } from '@/lib/utils';
import ApiImage from '@/components/ui/ApiImage';

interface CartItemRowProps {
  item: CartItem;
  isBusy: boolean;
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

export default function CartItemRow({
  item,
  isBusy,
  onQuantityChange,
  onRemove,
}: CartItemRowProps) {
  // آیتمی که دیگه موجود نیست
  if (!item.available) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="min-w-0">
          {item.product?.name && (
            <p className="truncate text-sm font-bold text-ink-900">{item.product.name}</p>
          )}
          <p className="text-xs font-bold text-red-500">{item.message}</p>
        </div>
        <button
          onClick={() => onRemove(item._id)}
          disabled={isBusy}
          className="flex shrink-0 items-center gap-1 rounded-md px-3 py-2 text-xs font-bold text-red-500 transition hover:bg-red-100 disabled:opacity-50"
        >
          {isBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
          حذف
        </button>
      </div>
    );
  }

  const { product, variant, quantity, lineTotal, stockWarning } = item;
  const unitPrice = variant.discountPrice || variant.price;
  const variantLabel = [variant.voltage, variant.size, variant.brand].filter(Boolean).join(' - ');

  return (
    <div className="flex gap-3 rounded-lg border border-ink-800/10 bg-white p-3 sm:gap-4 sm:p-4">
      <Link
        href={`/products/${product.slug}`}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-ink-100 sm:h-24 sm:w-24"
      >
        {product.image ? (
          <ApiImage
            src={product.image}
            alt={product.name}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink-900 to-ink-800">
            <Zap className="h-6 w-6 text-brand-500" />
          </div>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <Link
            href={`/products/${product.slug}`}
            className="line-clamp-1 text-sm font-bold text-ink-900 hover:text-brand-600"
          >
            {product.name}
          </Link>
          {variantLabel && <p className="mt-0.5 text-xs text-ink-800/45">{variantLabel}</p>}
          {stockWarning && <p className="mt-1 text-xs font-bold text-amber-600">{stockWarning}</p>}
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center overflow-hidden rounded-md border border-ink-800/15">
            <button
              onClick={() => onQuantityChange(item._id, quantity - 1)}
              disabled={isBusy || quantity <= 1}
              className="flex h-8 w-8 items-center justify-center text-ink-800/60 transition hover:bg-ink-800/5 disabled:opacity-30"
              aria-label="کاهش تعداد"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="flex h-8 w-9 items-center justify-center text-sm font-bold text-ink-900">
              {isBusy ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-500" />
              ) : (
                quantity.toLocaleString('fa-IR')
              )}
            </span>
            <button
              onClick={() => onQuantityChange(item._id, quantity + 1)}
              disabled={isBusy || quantity >= variant.stock}
              className="flex h-8 w-8 items-center justify-center text-ink-800/60 transition hover:bg-ink-800/5 disabled:opacity-30"
              aria-label="افزایش تعداد"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-left">
              {quantity > 1 && (
                <p className="text-[11px] text-ink-800/40">هر عدد {formatPrice(unitPrice)}</p>
              )}
              <p className="text-sm font-black text-brand-600">{formatPrice(lineTotal)}</p>
            </div>
            <button
              onClick={() => onRemove(item._id)}
              disabled={isBusy}
              className="flex h-8 w-8 items-center justify-center rounded-md text-ink-800/40 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
              aria-label="حذف از سبد"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}