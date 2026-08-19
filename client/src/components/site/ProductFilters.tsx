'use client';

import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import api from '@/lib/axios';
import { Category } from '@/types/category';

interface ProductFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export default function ProductFilters({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: ProductFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api
      .get<Category[]>('/categories')
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  return (
    <aside className="w-full shrink-0 md:w-64">
      <div className="mb-6">
        <label className="mb-2 block text-xs font-bold text-ink-800/60">جستجو</label>
        <div className="relative">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-800/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="نام محصول..."
            className="w-full rounded-md border border-ink-800/15 bg-white py-2.5 pr-10 pl-8 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-800/30 hover:text-ink-800/60"
              aria-label="پاک کردن جستجو"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold text-ink-800/60">دسته‌بندی</p>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => onCategoryChange('')}
            className={`rounded-md px-3 py-2 text-right text-sm transition ${
              selectedCategory === ''
                ? 'bg-brand-500/10 font-bold text-brand-600'
                : 'text-ink-800/60 hover:bg-ink-800/5'
            }`}
          >
            همه محصولات
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => onCategoryChange(category._id)}
              className={`rounded-md px-3 py-2 text-right text-sm transition ${
                selectedCategory === category._id
                  ? 'bg-brand-500/10 font-bold text-brand-600'
                  : 'text-ink-800/60 hover:bg-ink-800/5'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}