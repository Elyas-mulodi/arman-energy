'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Search, Plus, Pencil, Trash2, Star } from 'lucide-react';
import { Product } from '@/types/product';
import { deleteProduct, toggleProductActive } from '@/lib/adminProducts';
import { formatPrice } from '@/lib/utils';
import StatusBadge from './StatusBadge';

export default function ProductsTable({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.trim().toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(q) || p.category?.name?.toLowerCase().includes(q));
  }, [products, search]);

  const handleToggleActive = async (product: Product) => {
    setBusyId(product._id);
    try {
      const updated = await toggleProductActive(product._id, !product.isActive);
      setProducts((prev) => prev.map((p) => (p._id === product._id ? updated : p)));
    } catch {
      toast.error('خطا در تغییر وضعیت محصول');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirmingDeleteId !== id) {
      setConfirmingDeleteId(id);
      return;
    }
    setBusyId(id);
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success('محصول حذف شد');
    } catch {
      toast.error('خطا در حذف محصول');
    } finally {
      setBusyId(null);
      setConfirmingDeleteId(null);
    }
  };

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-800/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی محصول یا دسته‌بندی..."
            className="w-full rounded-md border border-ink-800/15 bg-white py-2 pr-9 pl-3 text-sm outline-none focus:border-brand-500"
          />
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center justify-center gap-1.5 rounded-md bg-brand-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-600"
        >
          <Plus className="h-4 w-4" />
          افزودن محصول
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-ink-800/10 bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-ink-800/10 text-right text-xs text-ink-800/45">
              <th className="px-4 py-3 font-medium">محصول</th>
              <th className="px-4 py-3 font-medium">دسته‌بندی</th>
              <th className="px-4 py-3 font-medium">قیمت پایه</th>
              <th className="px-4 py-3 font-medium">موجودی کل</th>
              <th className="px-4 py-3 font-medium">وضعیت</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product._id} className="border-b border-ink-800/5 last:border-0 hover:bg-ink-100/40">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-ink-100">
                      {product.images[0] && (
                        <Image src={product.images[0]} alt={product.name} fill sizes="40px" className="object-cover" />
                      )}
                    </div>
                    <div>
                      <p className="flex items-center gap-1.5 font-bold text-ink-900">
                        {product.name}
                        {product.isFeatured && <Star className="h-3 w-3 fill-amber-400 text-amber-400" />}
                      </p>
                      <p className="text-xs text-ink-800/40">
                        {product.variants.length.toLocaleString('fa-IR')} وریانت
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-800/70">{product.category?.name || '-'}</td>
                <td className="px-4 py-3 text-ink-800/70">
                  {product.variants.length > 0
                    ? formatPrice(Math.min(...product.variants.map((v) => v.discountPrice || v.price)))
                    : '-'}
                </td>
                <td className="px-4 py-3">
                  <span className={product.totalStock <= 5 ? 'font-bold text-amber-600' : 'text-ink-800/70'}>
                    {product.totalStock.toLocaleString('fa-IR')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => handleToggleActive(product)} disabled={busyId === product._id}>
                    <StatusBadge active={product.isActive} />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/products/${product._id}/edit`}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-ink-800/40 transition hover:bg-brand-500/10 hover:text-brand-600"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      onBlur={() => setConfirmingDeleteId(null)}
                      disabled={busyId === product._id}
                      className={`flex h-8 items-center justify-center rounded-md px-2 text-xs font-bold transition ${
                        confirmingDeleteId === product._id
                          ? 'bg-red-500/10 text-red-500'
                          : 'w-8 text-ink-800/40 hover:bg-red-500/10 hover:text-red-500'
                      }`}
                    >
                      {confirmingDeleteId === product._id ? 'مطمئنی؟' : <Trash2 className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-ink-800/40">محصولی یافت نشد</p>
        )}
      </div>
    </div>
  );
}