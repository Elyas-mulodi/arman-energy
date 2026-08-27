'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, FolderX, Loader2, X, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/axios';
import { getErrorMessage } from '@/store/useAuthStore';
import { Category } from '@/types/category';

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '');

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get<Category[]>('/categories/admin');
      setCategories(data);
    } catch {
      toast.error('خطا در دریافت دسته‌بندی‌ها');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const getParentName = (parentId: string | null): string => {
    if (!parentId) return '—';
    return categories.find((c) => c._id === parentId)?.name || '—';
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    const category = categoryToDelete;

    setDeletingId(category._id);
    try {
      await api.delete(`/categories/${category._id}`);
      setCategories((prev) => prev.filter((c) => c._id !== category._id));
      toast.success('دسته‌بندی حذف شد');
    } catch (error) {
      // بک‌اند اگه این دسته زیردسته داشته باشه، پیام مشخصی برمی‌گردونه - همون رو مستقیم نشون می‌دیم
      toast.error(getErrorMessage(error));
    } finally {
      setDeletingId(null);
      setCategoryToDelete(null);
    }
  };

  return (
    <div>
      {/* هدر */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-ink-900">دسته‌بندی‌ها</h1>
          <p className="mt-1 text-sm text-ink-800/40">
            {isLoading
              ? 'در حال بارگذاری…'
              : `${categories.length.toLocaleString('fa-IR')} دسته‌بندی ثبت‌شده`}
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center justify-center gap-1.5 rounded-md bg-brand-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-600 hover:shadow active:scale-[0.98] sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          دسته‌بندی جدید
        </Link>
      </div>

      {/* حالت لودینگ */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-ink-800/10 bg-white py-20">
          <Loader2 className="mb-3 h-6 w-6 animate-spin text-brand-500" />
          <p className="text-sm text-ink-800/40">در حال دریافت دسته‌بندی‌ها…</p>
        </div>
      ) : categories.length === 0 ? (
        /* حالت خالی */
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-ink-800/15 bg-white py-20 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-ink-100">
            <FolderX className="h-7 w-7 text-ink-800/30" />
          </div>
          <p className="text-sm font-bold text-ink-800/50">هنوز دسته‌بندی‌ای ثبت نشده</p>
          <p className="mt-1 text-xs text-ink-800/30">
            با دکمه «دسته‌بندی جدید» اولین دسته رو اضافه کن
          </p>
        </div>
      ) : (
        <>
          {/* --- نمای موبایل: کارت‌ها --- */}
          <div className="grid grid-cols-1 gap-2 sm:hidden">
            {categories.map((category) => (
              <div
                key={category._id}
                className="flex items-center gap-2.5 rounded-lg border border-ink-800/10 bg-white px-2.5 py-2 shadow-sm"
              >
                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-md bg-ink-100">
                  {category.image && (
                    <img
                      src={`${API_BASE}${category.image}`}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-[13px] font-bold leading-tight text-ink-900">
                      {category.name}
                    </span>
                    <span
                      className={`shrink-0 rounded px-1.5 py-[1px] text-[9px] font-bold ${
                        category.isActive
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-ink-800/5 text-ink-800/40'
                      }`}
                    >
                      {category.isActive ? 'فعال' : 'غیرفعال'}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-ink-800/40">
                    <span className="truncate">والد: {getParentName(category.parent)}</span>
                    <span className="shrink-0">·</span>
                    <span className="shrink-0">ترتیب: {category.order}</span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center">
                  <Link
                    href={`/admin/categories/${category._id}/edit`}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-ink-800/50 active:bg-ink-800/5"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    onClick={() => setCategoryToDelete(category)}
                    disabled={deletingId === category._id}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-ink-800/50 active:bg-red-50 active:text-red-500 disabled:opacity-40"
                  >
                    {deletingId === category._id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* --- نمای دسکتاپ: جدول --- */}
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
                      className="border-b border-ink-800/5 transition-colors last:border-0 hover:bg-ink-100/40"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-md bg-ink-100">
                            {category.image && (
                              <img
                                src={`${API_BASE}${category.image}`}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <span className="font-bold text-ink-900">{category.name}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink-800/60">
                        {getParentName(category.parent)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink-800/60">
                        {category.order}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={`rounded px-2 py-1 text-[11px] font-bold ${
                            category.isActive
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-ink-800/5 text-ink-800/40'
                          }`}
                        >
                          {category.isActive ? 'فعال' : 'غیرفعال'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/admin/categories/${category._id}/edit`}
                            className="flex h-8 w-8 items-center justify-center rounded-md text-ink-800/50 transition hover:bg-ink-800/5 hover:text-brand-600"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => setCategoryToDelete(category)}
                            disabled={deletingId === category._id}
                            className="flex h-8 w-8 items-center justify-center rounded-md text-ink-800/50 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                          >
                            {deletingId === category._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* --- مودال تأیید حذف --- */}
      {categoryToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 px-4 backdrop-blur-[2px]"
          onClick={() => deletingId === null && setCategoryToDelete(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <button
                onClick={() => setCategoryToDelete(null)}
                disabled={deletingId !== null}
                className="flex h-7 w-7 items-center justify-center rounded-md text-ink-800/30 transition hover:bg-ink-800/5 hover:text-ink-800/60 disabled:opacity-40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <h2 className="mt-3 text-base font-black text-ink-900">حذف دسته‌بندی</h2>
            <p className="mt-1.5 text-sm leading-6 text-ink-800/50">
              آیا از حذف دسته‌بندی{' '}
              <span className="font-bold text-ink-800/80">«{categoryToDelete.name}»</span> مطمئن
              هستید؟ این عملیات قابل بازگشت نیست.
            </p>

            <div className="mt-5 flex items-center gap-2">
              <button
                onClick={() => setCategoryToDelete(null)}
                disabled={deletingId !== null}
                className="flex-1 rounded-lg border border-ink-800/10 py-2.5 text-sm font-bold text-ink-800/60 transition hover:bg-ink-100/50 disabled:opacity-40"
              >
                انصراف
              </button>
              <button
                onClick={confirmDelete}
                disabled={deletingId !== null}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-500 py-2.5 text-sm font-bold text-white transition hover:bg-red-600 disabled:opacity-60"
              >
                {deletingId !== null ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                حذف دسته‌بندی
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}