'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, AlertTriangle } from 'lucide-react';
import api from '@/lib/axios';
import { Category } from '@/types/category';
import CategoryForm from '@/components/admin/CategoryForm';

export default function EditCategoryPage() {
  const params = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    api
      .get<Category[]>('/categories/admin')
      .then((res) => {
        const found = res.data.find((c) => c._id === params.id);
        if (found) {
          setCategory(found);
          setStatus('success');
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
  }, [params.id]);

  if (status === 'loading') {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3 sm:h-64">
        <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
        <p className="text-xs text-ink-800/40 sm:hidden">در حال بارگذاری دسته‌بندی…</p>
      </div>
    );
  }

  if (status === 'error' || !category) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-2 px-4 text-center sm:h-64">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="h-6 w-6 text-red-400" />
        </div>
        <p className="text-sm font-bold text-ink-800/50">دسته‌بندی یافت نشد</p>
        <p className="text-xs text-ink-800/30">ممکنه حذف شده یا آدرس اشتباه باشه</p>
      </div>
    );
  }

  return (
    <div className="pb-6">
      <h1 className="mb-4 text-lg font-black text-ink-900 sm:mb-6 sm:text-2xl">
        ویرایش دسته‌بندی
      </h1>
      <CategoryForm initialCategory={category} />
    </div>
  );
}