import Link from 'next/link';
import { ShoppingCart, ArrowLeft } from 'lucide-react';

export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-md border border-dashed border-ink-800/15 py-24 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-md bg-brand-500/10 text-brand-500">
        <ShoppingCart className="h-7 w-7" strokeWidth={1.5} />
      </span>
      <div>
        <p className="mb-1 text-base font-bold text-ink-900">سبد خرید شما خالی است</p>
        <p className="text-sm text-ink-800/40">محصولی برای نمایش وجود ندارد</p>
      </div>
      <Link
        href="/products"
        className="mt-2 flex items-center gap-2 rounded-md bg-brand-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600"
      >
        مشاهده محصولات
        <ArrowLeft className="h-4 w-4" />
      </Link>
    </div>
  );
}