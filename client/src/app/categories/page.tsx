'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AlertTriangle, LayoutGrid } from 'lucide-react';
import api from '@/lib/axios';
import { Category } from '@/types/category';
import CategoryCard from '@/components/site/CategoryCard';
import EmptyState from '@/components/ui/EmptyState';

type Status = 'loading' | 'success' | 'error';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    const controller = new AbortController();

    api
      .get<Category[]>('/categories', { signal: controller.signal })
      .then((res) => {
        setCategories(res.data);
        setStatus('success');
      })
      .catch((error) => {
        if (axios.isCancel(error)) return;
        setStatus('error');
      });

    return () => controller.abort();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-ink-900">دسته‌بندی‌ها</h1>
        <p className="mt-1 text-sm text-ink-800/50">
          محصول مورد نظرت رو بر اساس نیازت پیدا کن
        </p>
      </div>

      {status === 'loading' && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-lg bg-ink-800/5" />
          ))}
        </div>
      )}

      {status === 'error' && (
        <EmptyState
          icon={AlertTriangle}
          title="مشکلی در دریافت دسته‌بندی‌ها پیش آمد"
          description="لطفا اتصال اینترنت خود را بررسی کرده و دوباره تلاش کنید"
        />
      )}

      {status === 'success' && categories.length === 0 && (
        <EmptyState
          icon={LayoutGrid}
          title="هنوز دسته‌بندی‌ای ثبت نشده"
          description="به‌زودی دسته‌بندی‌های جدید اضافه می‌شوند"
        />
      )}

      {status === 'success' && categories.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category, index) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
            >
              <CategoryCard category={category} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}