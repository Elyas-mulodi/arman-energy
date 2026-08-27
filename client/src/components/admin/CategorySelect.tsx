'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Category } from '@/types/category';

interface CategorySelectProps {
  value: string;
  onChange: (categoryId: string) => void;
}

export default function CategorySelect({ value, onChange }: CategorySelectProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api
      .get<Category[]>('/categories/admin')
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-xs font-bold text-ink-800/60">دسته‌بندی</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full rounded-md border border-ink-800/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
      >
        <option value="">انتخاب دسته‌بندی</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
}