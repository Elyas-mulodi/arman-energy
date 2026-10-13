import Link from 'next/link';
import { Zap } from 'lucide-react';
import { Category } from '@/types/category';
import ApiImage from '@/components/ui/ApiImage';

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative flex h-40 items-end overflow-hidden rounded-lg border border-ink-800/10 bg-ink-900"
    >
      {category.image ? (
        <>
          <ApiImage
            src={category.image}
            alt={category.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/30 to-transparent" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-ink-800 to-ink-900" />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'linear-gradient(var(--color-ink-100) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink-100) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />
          <span className="absolute left-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/10 text-brand-500 transition group-hover:scale-110">
            <Zap className="h-4 w-4" />
          </span>
        </>
      )}
      <div className="relative z-10 p-4">
        <p className="text-sm font-bold text-white">{category.name}</p>
      </div>
    </Link>
  );
}