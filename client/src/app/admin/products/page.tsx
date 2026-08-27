'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, PackageX, Loader2, Layers, X, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/axios';
import { getErrorMessage } from '@/store/useAuthStore';
import { Product } from '@/types/product';
import { formatPrice } from '@/lib/utils';

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '');

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get<Product[]>('/products/admin');
      setProducts(data);
    } catch {
      toast.error('خطا در دریافت محصولات');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const confirmDelete = async () => {
    if (!productToDelete) return;
    const product = productToDelete;

    setDeletingId(product._id);
    try {
      await api.delete(`/products/${product._id}`);
      setProducts((prev) => prev.filter((p) => p._id !== product._id));
      toast.success('محصول حذف شد');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setDeletingId(null);
      setProductToDelete(null);
    }
  };

  return (
    <div>
      {/* هدر */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-ink-900">محصولات</h1>
          <p className="mt-1 text-sm text-ink-800/40">
            {isLoading ? 'در حال بارگذاری…' : `${products.length.toLocaleString('fa-IR')} محصول ثبت‌شده`}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center justify-center gap-1.5 rounded-md bg-brand-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-600 hover:shadow active:scale-[0.98] sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          محصول جدید
        </Link>
      </div>

      {/* حالت لودینگ */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-ink-800/10 bg-white py-20">
          <Loader2 className="mb-3 h-6 w-6 animate-spin text-brand-500" />
          <p className="text-sm text-ink-800/40">در حال دریافت محصولات…</p>
        </div>
      ) : products.length === 0 ? (
        /* حالت خالی */
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-ink-800/15 bg-white py-20 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-ink-100">
            <PackageX className="h-7 w-7 text-ink-800/30" />
          </div>
          <p className="text-sm font-bold text-ink-800/50">هنوز محصولی ثبت نشده</p>
          <p className="mt-1 text-xs text-ink-800/30">با دکمه «محصول جدید» اولین محصول خودت رو اضافه کن</p>
        </div>
      ) : (
        <>
          {/* --- نمای موبایل: کارت‌ها --- */}
          <div className="grid grid-cols-1 gap-2 sm:hidden">
            {products.map((product) => {
              const categoryName =
                typeof product.category === 'string' ? '-' : product.category.name;
              const basePrice = product.variants[0]?.price || 0;
              const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

              return (
                <div
                  key={product._id}
                  className="flex items-center gap-2.5 rounded-lg border border-ink-800/10 bg-white px-2.5 py-2 shadow-sm"
                >
                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-md bg-ink-100">
                    {product.images[0] && (
                      <img
                        src={`${API_BASE}${product.images[0]}`}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-[13px] font-bold leading-tight text-ink-900">
                        {product.name}
                      </span>
                      <span
                        className={`shrink-0 rounded px-1.5 py-[1px] text-[9px] font-bold ${
                          product.isActive
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-ink-800/5 text-ink-800/40'
                        }`}
                      >
                        {product.isActive ? 'فعال' : 'غیرفعال'}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-[11px] text-ink-800/40">
                      <span className="truncate">{categoryName}</span>
                      <span className="shrink-0">·</span>
                      <span className="shrink-0 font-bold text-ink-800/70">
                        {formatPrice(basePrice)}
                      </span>
                      <span className="shrink-0 flex items-center gap-0.5">
                        <Layers className="h-3 w-3" />
                        {totalStock.toLocaleString('fa-IR')}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center">
                    <Link
                      href={`/admin/products/${product._id}/edit`}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-ink-800/50 active:bg-ink-800/5"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      onClick={() => setProductToDelete(product)}
                      disabled={deletingId === product._id}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-ink-800/50 active:bg-red-50 active:text-red-500 disabled:opacity-40"
                    >
                      {deletingId === product._id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* --- نمای دسکتاپ: جدول --- */}
          <div className="hidden overflow-hidden rounded-xl border border-ink-800/10 bg-white sm:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink-800/10 bg-ink-100/50 text-right text-xs text-ink-800/50">
                    <th className="whitespace-nowrap px-4 py-3 font-bold">محصول</th>
                    <th className="whitespace-nowrap px-4 py-3 font-bold">دسته‌بندی</th>
                    <th className="whitespace-nowrap px-4 py-3 font-bold">قیمت پایه</th>
                    <th className="whitespace-nowrap px-4 py-3 font-bold">موجودی کل</th>
                    <th className="whitespace-nowrap px-4 py-3 font-bold">وضعیت</th>
                    <th className="whitespace-nowrap px-4 py-3 font-bold">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const categoryName =
                      typeof product.category === 'string' ? '-' : product.category.name;
                    const basePrice = product.variants[0]?.price || 0;
                    const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

                    return (
                      <tr
                        key={product._id}
                        className="border-b border-ink-800/5 transition-colors last:border-0 hover:bg-ink-100/40"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-ink-100">
                              {product.images[0] && (
                                <img
                                  src={`${API_BASE}${product.images[0]}`}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              )}
                            </div>
                            <span className="font-bold text-ink-900">{product.name}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-ink-800/60">
                          {categoryName}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-ink-800/60">
                          {formatPrice(basePrice)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-ink-800/60">
                          {totalStock.toLocaleString('fa-IR')}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <span
                            className={`rounded px-2 py-1 text-[11px] font-bold ${
                              product.isActive
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-ink-800/5 text-ink-800/40'
                            }`}
                          >
                            {product.isActive ? 'فعال' : 'غیرفعال'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Link
                              href={`/admin/products/${product._id}/edit`}
                              className="flex h-8 w-8 items-center justify-center rounded-md text-ink-800/50 transition hover:bg-ink-800/5 hover:text-brand-600"
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => setProductToDelete(product)}
                              disabled={deletingId === product._id}
                              className="flex h-8 w-8 items-center justify-center rounded-md text-ink-800/50 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                            >
                              {deletingId === product._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* --- مودال تأیید حذف --- */}
      {productToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 px-4 backdrop-blur-[2px]"
          onClick={() => deletingId === null && setProductToDelete(null)}
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
                onClick={() => setProductToDelete(null)}
                disabled={deletingId !== null}
                className="flex h-7 w-7 items-center justify-center rounded-md text-ink-800/30 transition hover:bg-ink-800/5 hover:text-ink-800/60 disabled:opacity-40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <h2 className="mt-3 text-base font-black text-ink-900">حذف محصول</h2>
            <p className="mt-1.5 text-sm leading-6 text-ink-800/50">
              آیا از حذف محصول{' '}
              <span className="font-bold text-ink-800/80">«{productToDelete.name}»</span> مطمئن
              هستید؟ این عملیات قابل بازگشت نیست.
            </p>

            <div className="mt-5 flex items-center gap-2">
              <button
                onClick={() => setProductToDelete(null)}
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
                حذف محصول
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}