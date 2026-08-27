'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/axios';
import { getErrorMessage } from '@/store/useAuthStore';
import { Product } from '@/types/product';
import { VariantDraft, SpecDraft, emptyVariant } from '@/types/productForm';
import CategorySelect from './CategorySelect';
import VariantFieldsEditor from './VariantFieldsEditor';
import SpecFieldsEditor from './SpecFieldsEditor';
import ImageUploader from './ImageUploader';

interface ProductFormProps {
  initialProduct?: Product; // اگه پاس داده بشه، یعنی حالت ویرایش
}

function toVariantDrafts(product?: Product): VariantDraft[] {
  if (!product || product.variants.length === 0) return [{ ...emptyVariant }];
  return product.variants.map((v) => ({
    _id: v._id,
    voltage: v.voltage || '',
    size: v.size || '',
    brand: v.brand || '',
    sku: v.sku,
    price: String(v.price),
    discountPrice: v.discountPrice ? String(v.discountPrice) : '',
    stock: String(v.stock),
    isActive: v.isActive,
  }));
}

export default function ProductForm({ initialProduct }: ProductFormProps) {
  const router = useRouter();
  const isEditMode = Boolean(initialProduct);

  const [name, setName] = useState(initialProduct?.name || '');
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [categoryId, setCategoryId] = useState(
    typeof initialProduct?.category === 'string'
      ? initialProduct.category
      : initialProduct?.category?._id || ''
  );
  const [isFeatured, setIsFeatured] = useState(initialProduct?.isFeatured || false);
  const [variants, setVariants] = useState<VariantDraft[]>(toVariantDrafts(initialProduct));
  const [specs, setSpecs] = useState<SpecDraft[]>(initialProduct?.specifications || []);

  const [existingImages, setExistingImages] = useState<string[]>(initialProduct?.images || []);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);

  const [isSaving, setIsSaving] = useState(false);

  const handleRemoveExistingImage = (url: string) => {
    setExistingImages((prev) => prev.filter((img) => img !== url));
    setImagesToDelete((prev) => [...prev, url]);
  };

  const validateVariants = (): boolean => {
    for (const v of variants) {
      if (!v.sku.trim() || !v.price || !v.stock) {
        toast.error('برای هر وریانت، SKU، قیمت و موجودی الزامی است');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!categoryId) {
      toast.error('انتخاب دسته‌بندی الزامی است');
      return;
    }
    if (!validateVariants()) return;

    setIsSaving(true);

    try {
      // چون فایل داریم، باید از FormData استفاده کنیم نه JSON ساده
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('category', categoryId);
      formData.append('isFeatured', String(isFeatured));

      // variants و specifications به‌صورت JSON.stringify شده فرستاده میشن
      // چون کنترلر بک‌اند دقیقا همین انتظار رو داره (چون multipart فقط رشته/فایل قبول می‌کنه)
      const variantsPayload = variants.map((v) => ({
        ...(v._id && { _id: v._id }),
        voltage: v.voltage || undefined,
        size: v.size || undefined,
        brand: v.brand || undefined,
        sku: v.sku,
        price: Number(v.price),
        discountPrice: v.discountPrice ? Number(v.discountPrice) : null,
        stock: Number(v.stock),
        isActive: v.isActive,
      }));
      formData.append('variants', JSON.stringify(variantsPayload));

      const specsPayload = specs.filter((s) => s.key.trim() && s.value.trim());
      formData.append('specifications', JSON.stringify(specsPayload));

      newFiles.forEach((file) => formData.append('images', file));

      if (isEditMode && initialProduct) {
        await api.put(`/products/${initialProduct._id}`, formData);

        // عکس‌های حذف‌شده رو جدا پاک می‌کنیم چون بک‌اند یه روت مجزا براش داره
        for (const imageUrl of imagesToDelete) {
          await api.delete(`/products/${initialProduct._id}/images`, { data: { imageUrl } });
        }

        toast.success('محصول با موفقیت به‌روزرسانی شد');
      } else {
        await api.post('/products', formData);
        toast.success('محصول با موفقیت ایجاد شد');
      }

      router.push('/admin/products');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      <div className="mb-6 rounded-xl border border-ink-800/10 bg-white p-6">
        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-bold text-ink-800/60">نام محصول</label>
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
            rows={3}
            className="w-full resize-none rounded-md border border-ink-800/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
          />
        </div>

        <CategorySelect value={categoryId} onChange={setCategoryId} />

        <label className="mb-4 flex items-center gap-1.5 text-sm text-ink-800/70">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="accent-brand-500"
          />
          نمایش به‌عنوان محصول ویژه در صفحه اصلی
        </label>

        <ImageUploader
          existingImages={existingImages}
          onRemoveExisting={handleRemoveExistingImage}
          newFiles={newFiles}
          onNewFilesChange={setNewFiles}
        />
      </div>

      <div className="mb-6 rounded-xl border border-ink-800/10 bg-white p-6">
        <VariantFieldsEditor variants={variants} onChange={setVariants} />
        <SpecFieldsEditor specs={specs} onChange={setSpecs} />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center justify-center gap-2 rounded-md bg-brand-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600 disabled:opacity-60"
        >
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEditMode ? 'ذخیره تغییرات' : 'ایجاد محصول'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="rounded-md border border-ink-800/15 px-6 py-2.5 text-sm font-bold text-ink-800/70 hover:bg-ink-800/5"
        >
          انصراف
        </button>
      </div>
    </form>
  );
}