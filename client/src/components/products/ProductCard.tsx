import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';

function getDisplayPrice(product: Product) {
  const active = product.variants.filter((v) => v.isActive);
  if (active.length === 0) return null;
  return Math.min(...active.map((v) => v.discountPrice || v.price));
}

export default function ProductCard({ product }: { product: Product }) {
  const price = getDisplayPrice(product);
  const outOfStock = product.variants.every((v) => v.stock === 0 || !v.isActive);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-md border border-ink-800/10 bg-white transition hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-ink-100">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-ink-800/30">
            بدون تصویر
          </div>
        )}
        {outOfStock && (
          <span className="absolute right-2 top-2 rounded bg-ink-900/80 px-2 py-1 text-[10px] font-bold text-white">
            ناموجود
          </span>
        )}
      </div>

      <div className="p-3">
        <p className="line-clamp-2 text-sm font-medium text-ink-900">{product.name}</p>
        <div className="mt-2 flex items-baseline gap-1">
          {price !== null ? (
            <>
              <span className="text-sm font-bold text-ink-900">{price.toLocaleString('fa-IR')}</span>
              <span className="text-[10px] text-ink-800/50">تومان</span>
            </>
          ) : (
            <span className="text-xs text-ink-800/40">قیمت نامشخص</span>
          )}
        </div>
      </div>
    </Link>
  );
}