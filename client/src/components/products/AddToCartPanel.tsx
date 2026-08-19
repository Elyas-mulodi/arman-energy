'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { AxiosError } from 'axios';
import { Product, ProductVariant } from '@/types/product';
import { useCartStore } from '@/store/useCartStore';

function formatPrice(n: number) {
  return n.toLocaleString('fa-IR');
}

export default function AddToCartPanel({ product }: { product: Product }) {
  const router = useRouter();
  const addToCart = useCartStore((s) => s.addToCart);

  const activeVariants = useMemo(
    () => product.variants.filter((v) => v.isActive),
    [product.variants]
  );

  const [selected, setSelected] = useState<ProductVariant | null>(
    activeVariants.find((v) => v.stock > 0) || activeVariants[0] || null
  );
  const [qty, setQty] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const outOfStock = !selected || selected.stock <= 0;
  const finalPrice = selected ? selected.discountPrice || selected.price : 0;
  const hasDiscount = selected?.discountPrice && selected.discountPrice < selected.price;

  const handleSelectVariant = (variant: ProductVariant) => {
    setSelected(variant);
    setQty(1);
  };

  const changeQty = (delta: number) => {
    if (!selected) return;
    setQty((q) => Math.min(Math.max(1, q + delta), selected.stock));
  };

  const handleAddToCart = async () => {
    if (!selected || outOfStock) return;
    setIsAdding(true);
    try {
      await addToCart(product._id, selected._id, qty);
      toast.success('به سبد خرید اضافه شد');
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      if (axiosErr.response?.status === 401) {
        toast.error('برای افزودن به سبد ابتدا وارد شوید');
        router.push(`/login?redirect=/products/${product.slug}`);
      } else {
        toast.error(axiosErr.response?.data?.message || 'خطا در افزودن به سبد خرید');
      }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div>
      {activeVariants.length > 1 && (
        <div className="mb-5">
          <p className="mb-2 text-xs font-bold text-ink-800/60">انتخاب وریانت</p>
          <div className="flex flex-wrap gap-2">
            {activeVariants.map((v) => {
              const label = [v.voltage, v.size, v.brand].filter(Boolean).join(' - ') || v.sku;
              const isSelected = selected?._id === v._id;
              return (
                <button
                  key={v._id}
                  onClick={() => handleSelectVariant(v)}
                  disabled={v.stock <= 0}
                  className={`rounded-md border px-3 py-2 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
                    isSelected
                      ? 'border-brand-500 bg-brand-500/10 text-brand-600'
                      : 'border-ink-800/15 text-ink-800/70 hover:border-ink-800/30'
                  }`}
                >
                  {label}
                  {v.stock <= 0 && ' (ناموجود)'}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mb-5 flex items-baseline gap-2">
        {selected ? (
          <>
            <span className="text-2xl font-black text-ink-900">{formatPrice(finalPrice)}</span>
            <span className="text-xs text-ink-800/50">تومان</span>
            {hasDiscount && (
              <span className="text-sm text-ink-800/40 line-through">{formatPrice(selected.price)}</span>
            )}
          </>
        ) : (
          <span className="text-sm text-ink-800/40">موجود نیست</span>
        )}
      </div>

      {selected && (
        <p className={`mb-5 text-xs font-medium ${outOfStock ? 'text-red-600' : 'text-emerald-600'}`}>
          {outOfStock ? 'ناموجود' : `${selected.stock.toLocaleString('fa-IR')} عدد موجود`}
        </p>
      )}

      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-md border border-ink-800/15">
          <button
            onClick={() => changeQty(-1)}
            disabled={qty <= 1}
            className="flex h-10 w-10 items-center justify-center disabled:opacity-30"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-8 text-center text-sm font-bold">{qty.toLocaleString('fa-IR')}</span>
          <button
            onClick={() => changeQty(1)}
            disabled={!selected || qty >= selected.stock}
            className="flex h-10 w-10 items-center justify-center disabled:opacity-30"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={outOfStock || isAdding}
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-brand-500 text-sm font-bold text-white transition hover:bg-brand-600 disabled:opacity-50"
        >
          <ShoppingCart className="h-4 w-4" />
          {isAdding ? 'در حال افزودن...' : 'افزودن به سبد خرید'}
        </button>
      </div>
    </div>
  );
}