'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, PackageX, Loader2, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/axios';
import { getErrorMessage } from '@/store/useAuthStore';
import { Product } from '@/types/product';
import { formatPrice } from '@/lib/utils';
import ApiImage from '@/components/ui/ApiImage';

type Filter = 'all' | 'active' | 'inactive' | 'out';

const filters: { label: string; value: Filter }[] = [
  { label: 'همه', value: 'all' },
  { label: 'فعال', value: 'active' },
  { label: 'غیرفعال', value: 'inactive' },
  { label: 'ناموجود', value: 'out' },
];

const getTotalStock = (product: Product) =>
  product.variants.filter((v) => v.isActive).reduce((sum, v) => sum + v.stock, 0);

const getPriceLabel = (product: Product) => {
  const prices = product.variants.filter((v) => v.isActive).map((v) => v.discountPrice || v.price);
  if (prices.length === 0) return '—';
  const min = Math.min(...prices);
  return prices.length > 1 ? `از ${formatPrice(min)}` : formatPrice(min);
};

const getCategoryName = (product: Product) =>
  typeof product.category === 'string' ? '—' : product.category.name;

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return <span className="rounded bg-red-50 px-2 py-1 text-[11px] font-bold text-red-600">ناموجود</span>;
  }
  if (stock <= 5) {
    return (
      <span className="rounded bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-600">
        {stock.toLocaleString('fa-IR')} عدد
      </span>
    );
  }
  return <span className="text-ink-800/60">{stock.toLocaleString('fa-IR')} عدد</span>;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    api
      .get<Product[]>('/products/admin')
      .then((res) => setProducts(res.data))
      .catch(() => toast.error('خطا در دریافت محصولات'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`آیا از حذف محصول «${product.name}» مطمئن هستید؟`)) return;

    setDeletingId(product._id);
    try {
      await api.delete(`/products/${product._id}`);
      setProducts((prev) => prev.filter((p) => p._id !== product._id));
      toast.success('محصول حذف شد');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setDeletingId(null);
    }
  };

  const visibleProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((p) => {
      if (term && !p.name.toLowerCase().includes(term)) return false;
      if (filter === 'active') return p.isActive;
      if (filter === 'inactive') return !p.isActive;
      if (filter === 'out') return getTotalStock(p) === 0;
      return true;
    });
  }, [products, search, filter]);

  const renderActions = (product: Product) => (
    <div className="flex items-center gap-1">
      <Link
        href={`/admin/products/${product._id}/edit`}
        className="flex h-8 w-8 items-center justify-center rounded-md text-ink-800/50 hover:bg-ink-800/5 hover:text-brand-600"
        aria-label="ویرایش"
      >
        <Pencil className="h-4 w-4" />
      </Link>
      <button
        onClick={() => handleDelete(product)}
        disabled={deletingId === product._id}
        className="flex h-8 w-8 items-center justify-center rounded-md text-ink-800/50 hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
        aria-label="حذف"
      >
        {deletingId === product._id ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </button>
    </div>
  );

  const renderThumb = (product: Product, size: string, px: number) => (
    <div className={`relative ${size} shrink-0 overflow-hidden rounded-md bg-ink-100`}>
      {product.images[0] && (
        <ApiImage src={product.images[0]} alt="" fill sizes={`${px}px`} className="object-cover" />
      )}
    </div>
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-ink-900 sm:text-2xl">محصولات</h1>
          {!isLoading && (
            <p className="mt-0.5 text-xs text-ink-800/40">
              {products.length.toLocaleString('fa-IR')} محصول
            </p>
          )}
        </div>
        <Link
          href="/admin/products/new"
          className="flex shrink-0 items-center gap-1.5 rounded-md bg-brand-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-600"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">محصول جدید</span>
          <span className="sm:hidden">جدید</span>
        </Link>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`shrink-0 rounded-md px-3.5 py-2 text-xs font-bold transition ${
                filter === f.value
                  ? 'bg-brand-500 text-white'
                  : 'bg-white text-ink-800/60 hover:bg-ink-800/5'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-800/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی نام محصول..."
            className="w-full rounded-md border border-ink-800/15 bg-white py-2 pr-9 pl-8 text-sm outline-none focus:border-brand-500"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-800/30 hover:text-ink-800/60"
              aria-label="پاک کردن"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center rounded-xl border border-ink-800/10 bg-white py-16">
          <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
        </div>
      ) : visibleProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-ink-800/10 bg-white py-16 text-center">
          <PackageX className="mb-3 h-8 w-8 text-ink-800/20" />
          <p className="text-sm text-ink-800/40">
            {products.length === 0 ? 'هنوز محصولی ثبت نشده' : 'محصولی با این فیلتر یافت نشد'}
          </p>
        </div>
      ) : (
        <>
          {/* موبایل: کارت */}
          <div className="flex flex-col gap-3 sm:hidden">
            {visibleProducts.map((product) => (
              <div key={product._id} className="rounded-xl border border-ink-800/10 bg-white p-3">
                <div className="flex gap-3">
                  {renderThumb(product, 'h-16 w-16', 64)}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-ink-900">{product.name}</p>
                    <p className="text-xs text-ink-800/40">{getCategoryName(product)}</p>
                    <p className="mt-1 text-xs font-bold text-brand-600">{getPriceLabel(product)}</p>
                  </div>
                  {renderActions(product)}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-ink-800/5 pt-2.5 text-xs">
                  <StockBadge stock={getTotalStock(product)} />
                  <span
                    className={`rounded px-2 py-1 text-[11px] font-bold ${
                      product.isActive
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-ink-800/5 text-ink-800/40'
                    }`}
                  >
                    {product.isActive ? 'فعال' : 'غیرفعال'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* دسکتاپ: جدول */}
          <div className="hidden overflow-hidden rounded-xl border border-ink-800/10 bg-white sm:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink-800/10 bg-ink-100/50 text-right text-xs text-ink-800/50">
                    <th className="whitespace-nowrap px-4 py-3 font-bold">محصول</th>
                    <th className="whitespace-nowrap px-4 py-3 font-bold">دسته‌بندی</th>
                    <th className="whitespace-nowrap px-4 py-3 font-bold">قیمت</th>
                    <th className="whitespace-nowrap px-4 py-3 font-bold">موجودی</th>
                    <th className="whitespace-nowrap px-4 py-3 font-bold">وضعیت</th>
                    <th className="whitespace-nowrap px-4 py-3 font-bold">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b border-ink-800/5 last:border-0 hover:bg-ink-100/40"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {renderThumb(product, 'h-10 w-10', 40)}
                          <span className="font-bold text-ink-900">{product.name}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink-800/60">
                        {getCategoryName(product)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink-800/60">
                        {getPriceLabel(product)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <StockBadge stock={getTotalStock(product)} />
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
                      <td className="whitespace-nowrap px-4 py-3">{renderActions(product)}</td>
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