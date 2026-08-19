import Link from 'next/link';
import { Zap } from 'lucide-react';
import { Category } from '@/types/category';

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative flex h-40 items-end overflow-hidden rounded-lg border border-ink-800/10 bg-ink-900"
    >
      {category.image ? (
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${category.image}`}
          alt={category.name}
          className="absolute inset-0 h-full w-full object-cover opacity-50 transition duration-500 group-hover:scale-105 group-hover:opacity-40"
        />
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
          <span className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/10 text-brand-500 transition group-hover:scale-110">
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