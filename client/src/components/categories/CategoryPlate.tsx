import Link from 'next/link';
import Image from 'next/image';
import { Package, ArrowLeft } from 'lucide-react';
import Rivet from '@/components/ui/Rivet';
import { CategoryWithChildren } from '@/lib/categoryTree';

function refCode(index: number) {
  return `CAT-${String(index + 1).padStart(2, '0')}`;
}

export default function CategoryPlate({
  category,
  index,
}: {
  category: CategoryWithChildren;
  index: number;
}) {
  return (
    <article className="group relative overflow-hidden rounded-md border border-ink-800/15 bg-ink-900 transition-all duration-300 hover:border-brand-500/40 hover:shadow-lg">
      {/* نوار بالای پلاک */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-500 via-brand-500/60 to-transparent" />

      <div className="absolute right-3 top-3 z-10"><Rivet /></div>
      <div className="absolute left-3 top-3 z-10"><Rivet /></div>

      <Link href={`/products?category=${category._id}`} className="block">
        {/* تصویر */}
        <div className="relative aspect-[4/3] overflow-hidden bg-ink-800">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover opacity-70 transition duration-500 group-hover:scale-105 group-hover:opacity-90"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Package className="h-10 w-10 text-ink-100/15" strokeWidth={1.5} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/20 to-transparent" />

          <span
            className="absolute bottom-3 right-3 rounded bg-ink-900/70 px-2 py-1 font-mono text-[10px] tracking-widest text-brand-500 backdrop-blur-sm"
            dir="ltr"
          >
            {refCode(index)}
          </span>
        </div>

        {/* متن */}
        <div className="p-4">
          <h3 className="mb-1 text-base font-black text-ink-100 transition group-hover:text-brand-500">
            {category.name}
          </h3>
          {category.description && (
            <p className="mb-3 line-clamp-2 text-xs leading-5 text-ink-100/45">
              {category.description}
            </p>
          )}

          <div className="flex items-center gap-1 text-xs font-bold text-ink-100/60 transition group-hover:gap-2 group-hover:text-brand-500">
            مشاهده محصولات
            <ArrowLeft className="h-3.5 w-3.5" />
          </div>
        </div>
      </Link>

      {/* زیردسته‌ها */}
      {category.children.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-t border-ink-800 px-4 py-3">
          {category.children.map((child) => (
            <Link
              key={child._id}
              href={`/products?category=${child.slug}`}
              className="rounded border border-ink-800 px-2 py-1 text-[11px] text-ink-100/55 transition hover:border-brand-500/50 hover:text-brand-500"
            >
              {child.name}
            </Link>
          ))}
        </div>
      )}

      <div className="absolute bottom-3 right-3"><Rivet /></div>
      <div className="absolute bottom-3 left-3"><Rivet /></div>
    </article>
  );
}