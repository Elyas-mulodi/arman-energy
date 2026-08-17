'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Category } from '@/types/category';

export default function CategoryFilter({
  categories,
  activeSlug,
}: {
  categories: Category[];
  activeSlug?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setCategory = (slug?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    slug ? params.set('category', slug) : params.delete('category');
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <aside className="flex flex-col gap-1">
      <button
        onClick={() => setCategory(undefined)}
        className={`rounded-md px-3 py-2 text-right text-sm ${
          !activeSlug ? 'bg-brand-500/10 font-bold text-brand-500' : 'text-ink-800/70 hover:bg-ink-100'
        }`}
      >
        همه محصولات
      </button>
      {categories.map((cat) => (
        <button
          key={cat._id}
          onClick={() => setCategory(cat.slug)}
          className={`rounded-md px-3 py-2 text-right text-sm ${
            activeSlug === cat.slug
              ? 'bg-brand-500/10 font-bold text-brand-500'
              : 'text-ink-800/70 hover:bg-ink-100'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </aside>
  );
}