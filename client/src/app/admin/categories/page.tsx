'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, FolderX, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/axios';
import { getErrorMessage } from '@/store/useAuthStore';
import { Category } from '@/types/category';
import ApiImage from '@/components/ui/ApiImage';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Category[]>('/categories/admin')
      .then((res) => setCategories(res.data))
      .catch(() => toast.error('خطا در دریافت دسته‌بندی‌ها'))
      .finally(() => setIsLoading(false));
  }, []);

  const getParentName = (parentId: string | null): string => {
    if (!parentId) return '—';
    return categories.find((c) => c._id === parentId)?.name || '—';
  };

  const handleDelete = async (category: Category) => {
    if (!window.confirm(`آیا از حذف دسته‌بندی «${category.name}» مطمئن هستید؟`)) return;

    setDeletingId(category._id);
    try {
      await api.delete(`/categories/${category._id}`);
      setCategories((prev) => prev.filter((c) => c._id !== category._id));
      toast.success('دسته‌بندی حذف شد');
    } catch (error) {
      // بک‌اند اگر زیردسته داشته باشد پیام دقیق می‌دهد
      toast.error(getErrorMessage(error));
    } finally {
      setDeletingId(null);
    }
  };

  const renderThumb = (category: Category, size: string, px: number) => (
    <div className={`relative ${size} shrink-0 overflow-hidden rounded-md bg-ink-100`}>
      {category.image && (
        <ApiImage src={category.image} alt="" fill sizes={`${px}px`} className="object-cover" />
      )}
    </div>
  );

  const renderStatus = (category: Category) => (
    <span
      className={`rounded px-2 py-1 text-[11px] font-bold ${
        category.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-ink-800/5 text-ink-800/40'
      }`}
    >
      {category.isActive ? 'فعال' : 'غیرفعال'}
    </span>
  );

  const renderActions = (category: Category) => (
    <div className="flex items-center gap-1">
      <Link
        href={`/admin/categories/${category._id}/edit`}
        className="flex h-8 w-8 items-center justify-center rounded-md text-ink-800/50 hover:bg-ink-800/5 hover:text-brand-600"
        aria-label="ویرایش"
      >
        <Pencil className="h-4 w-4" />
      </Link>
      <button
        onClick={() => handleDelete(category)}
        disabled={deletingId === category._id}
        className="flex h-8 w-8 items-center justify-center rounded-md text-ink-800/50 hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
        aria-label="حذف"
      >
        {deletingId === category._id ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </button>
    </div>
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-xl font-black text-ink-900 sm:text-2xl">دسته‌بندی‌ها</h1>
        <Link
          href="/admin/categories/new"
          className="flex shrink-0 items-center gap-1.5 rounded-md bg-brand-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-600"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">دسته‌بندی جدید</span>
          <span className="sm:hidden">جدید</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center rounded-xl border border-ink-800/10 bg-white py-16">
          <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-ink-800/10 bg-white py-16 text-center">
          <FolderX className="mb-3 h-8 w-8 text-ink-800/20" />
          <p className="text-sm text-ink-800/40">هنوز دسته‌بندی‌ای ثبت نشده</p>
        </div>
      ) : (
        <>
          {/* موبایل: کارت */}
          <div className="flex flex-col gap-3 sm:hidden">
            {categories.map((category) => (
              <div
                key={category._id}
                className="flex items-center gap-3 rounded-xl border border-ink-800/10 bg-white p-3"
              >
                {renderThumb(category, 'h-12 w-12', 48)}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-ink-900">{category.name}</p>
                  <p className="text-xs text-ink-800/40">
                    والد: {getParentName(category.parent)}
                  </p>
                  <div className="mt-1.5">{renderStatus(category)}</div>
                </div>
                {renderActions(category)}
              </div>
            ))}
          </div>

          {/* دسکتاپ: جدول */}
          <div className="hidden overflow-hidden rounded-xl border border-ink-800/10 bg-white sm:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink-800/10 bg-ink-100/50 text-right text-xs text-ink-800/50">
                    <th className="whitespace-nowrap px-4 py-3 font-bold">نام</th>
                    <th className="whitespace-nowrap px-4 py-3 font-bold">دسته والد</th>
                    <th className="whitespace-nowrap px-4 py-3 font-bold">ترتیب</th>
                    <th className="whitespace-nowrap px-4 py-3 font-bold">وضعیت</th>
                    <th className="whitespace-nowrap px-4 py-3 font-bold">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr
                      key={category._id}
                      className="border-b border-ink-800/5 last:border-0 hover:bg-ink-100/40"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {renderThumb(category, 'h-9 w-9', 36)}
                          <span className="font-bold text-ink-900">{category.name}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink-800/60">
                        {getParentName(category.parent)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink-800/60">
                        {category.order.toLocaleString('fa-IR')}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">{renderStatus(category)}</td>
                      <td className="whitespace-nowrap px-4 py-3">{renderActions(category)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}