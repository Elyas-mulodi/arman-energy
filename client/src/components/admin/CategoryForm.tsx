'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ImagePlus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/axios';
import { getErrorMessage } from '@/store/useAuthStore';
import { Category } from '@/types/category';

interface CategoryFormProps {
  initialCategory?: Category;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '');

export default function CategoryForm({ initialCategory }: CategoryFormProps) {
  const router = useRouter();
  const isEditMode = Boolean(initialCategory);

  const [name, setName] = useState(initialCategory?.name || '');
  const [description, setDescription] = useState(initialCategory?.description || '');
  const [parentId, setParentId] = useState(initialCategory?.parent || '');
  const [order, setOrder] = useState(String(initialCategory?.order ?? 0));
  const [isActive, setIsActive] = useState(initialCategory?.isActive ?? true);

  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [existingImage, setExistingImage] = useState(initialCategory?.image || '');
  const [newFile, setNewFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    api
      .get<Category[]>('/categories/admin')
      .then((res) => {
        // نمی‌تونی خودِ این دسته‌بندی رو والد خودش انتخاب کنی - از لیست حذفش می‌کنیم
        const filtered = initialCategory
          ? res.data.filter((c) => c._id !== initialCategory._id)
          : res.data;
        setAllCategories(filtered);
      })
      .catch(() => setAllCategories([]));
  }, [initialCategory]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('order', order);
      formData.append('isActive', String(isActive));
      if (parentId) formData.append('parent', parentId);
      if (newFile) formData.append('image', newFile);

      if (isEditMode && initialCategory) {
        await api.put(`/categories/${initialCategory._id}`, formData);
        toast.success('دسته‌بندی با موفقیت به‌روزرسانی شد');
      } else {
        await api.post('/categories', formData);
        toast.success('دسته‌بندی با موفقیت ایجاد شد');
      }

      router.push('/admin/categories');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
      <div className="rounded-xl border border-ink-800/10 bg-white p-4 sm:p-6">
        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-bold text-ink-800/60">نام دسته‌بندی</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-md border border-ink-800/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
          />
        </div>

        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-bold text-ink-800/60">توضیحات</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-md border border-ink-800/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
          />
        </div>

        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-bold text-ink-800/60">
            دسته‌بندی والد (اختیاری)
          </label>
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="w-full rounded-md border border-ink-800/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
          >
            <option value="">— بدون والد (دسته‌ی اصلی) —</option>
            {allCategories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-ink-800/60">
              ترتیب نمایش
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="w-full rounded-md border border-ink-800/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
            />
          </div>

          <div className="flex items-end pb-2.5">
            <label className="flex items-center gap-1.5 text-xs font-bold text-ink-800/60 sm:text-sm sm:font-normal sm:text-ink-800/70">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 shrink-0 accent-brand-500"
              />
              فعال و قابل نمایش
            </label>
          </div>
        </div>

        <div className="mb-2">
          <label className="mb-2 block text-xs font-bold text-ink-800/60">تصویر</label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {(existingImage || newFile) && (
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-ink-800/10">
                <img
                  src={newFile ? URL.createObjectURL(newFile) : `${API_BASE}${existingImage}`}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <label className="flex h-16 flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-ink-800/20 text-xs text-ink-800/50 transition hover:border-brand-500/40 hover:bg-ink-100/40 sm:h-auto sm:flex-none sm:justify-start sm:border-0 sm:p-0 sm:hover:bg-transparent">
              <ImagePlus className="h-4 w-4 shrink-0 sm:hidden" />
              <span className="truncate px-2 sm:hidden">
                {newFile ? newFile.name : 'انتخاب تصویر جدید'}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setNewFile(e.target.files?.[0] || null)}
                className="hidden text-xs text-ink-800/60 sm:block"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 mt-4 flex items-center gap-3 border-t border-ink-800/5 bg-ink-50/95 py-3 backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:py-0">
        <button
          type="submit"
          disabled={isSaving}
          className="flex flex-1 items-center justify-center gap-2 rounded-md bg-brand-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600 disabled:opacity-60 sm:flex-none"
        >
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEditMode ? 'ذخیره تغییرات' : 'ایجاد دسته‌بندی'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/categories')}
          className="flex-1 rounded-md border border-ink-800/15 px-6 py-2.5 text-sm font-bold text-ink-800/70 hover:bg-ink-800/5 sm:flex-none"
        >
          انصراف
        </button>
      </div>
    </form>
  );
}