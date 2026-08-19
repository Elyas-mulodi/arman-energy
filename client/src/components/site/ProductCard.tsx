import Link from 'next/link';
import { Zap } from 'lucide-react';
import { Product } from '@/types/product';
import { formatPrice } from '@/lib/utils';

export default function ProductCard({ product }: { product: Product }) {
  const firstVariant = product.variants[0];
  const price = firstVariant?.discountPrice || firstVariant?.price || 0;
  const hasDiscount = Boolean(firstVariant?.discountPrice);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-lg border border-ink-800/10 bg-white transition hover:-translate-y-1 hover:shadow-lg hover:shadow-ink-900/10"
    >
      <div className="relative aspect-square overflow-hidden bg-ink-100">
        {product.images[0] ? (
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${product.images[0]}`}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-ink-900 to-ink-800">
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  'linear-gradient(var(--color-ink-100) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink-100) 1px, transparent 1px)',
                backgroundSize: '18px 18px',
              }}
            />
            <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10 text-brand-500">
              <Zap className="h-5 w-5" strokeWidth={2} />
            </span>
          </div>
        )}
        {hasDiscount && (
          <span className="absolute right-2 top-2 rounded-md bg-accent-500 px-2 py-1 text-[10px] font-bold text-white">
            تخفیف
          </span>
        )}
      </div>

      <div className="p-3">
        <p className="mb-1 line-clamp-1 text-sm font-bold text-ink-900">{product.name}</p>
        <div className="flex items-center gap-2">
          {hasDiscount && (
            <span className="text-xs text-ink-800/40 line-through">
              {formatPrice(firstVariant.price)}
            </span>
          )}
          <span className="text-sm font-bold text-brand-600">{formatPrice(price)}</span>
        </div>
      </div>
    </Link>
  );
}