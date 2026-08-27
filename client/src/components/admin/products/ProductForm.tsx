'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { Category } from '@/types/category';
import { Product, VariantFormValue, SpecFormValue } from '@/types/product';
import { createProduct, updateProduct } from '@/lib/adminProducts';
import { getErrorMessage } from '@/store/useAuthStore';
import VariantEditor from './VariantEditor';
import SpecEditor from './SpecEditor';
import ImageManager from './ImageManager';

const inputClass =
  'w-full rounded-md border border-ink-800/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500';

function productToVariantForm(product?: Product): VariantFormValue[] {
  if (!product) return [];
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

function productToSpecForm(product?: Product): SpecFormValue[] {
  if (!product) return [];
  return product.specifications.map((s) => ({ key: s.key, value: s.value }));
}

export default function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const router = useRouter();
  const isEdit = !!product;

  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [category, setCategory] = useState(product?.category?._id || categories[0]?._id || '');
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured || false);
  const [variants, setVariants] = useState<VariantFormValue[]>(productToVariantForm(product));
  const [specs, setSpecs] = useState<SpecFormValue[]>(productToSpecForm(product));
  const [existingImages, setExistingImages] = useState<string[]>(product?.images || []);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [removingImage, setRemovingImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const buildFormData = () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('isFeatured', String(isFeatured));

    const cleanVariants = variants.map((v) => {
      const base: Record<string, unknown> = {
        voltage: v.voltage,
        size: v.size,
        brand: v.brand,
        sku: v.sku,
        price: Number(v.price),
        discountPrice: v.discountPrice ? Number(v.discountPrice) : null,
        stock: Number(v.stock),
        isActive: v.isActive,
      };
      if (v._id) base._id = v._id; // حفظ آی‌دی وریانت‌های موجود
      return base;
    });
    formData.append('variants', JSON.stringify(cleanVariants));

    const cleanSpecs = specs.filter((s) => s.key.trim() && s.value.trim());
    formData.append('specifications', JSON.stringify(cleanSpecs));

    newFiles.forEach((file) => formData.append('images', file));

    return formData;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!category) {
      toast.error('انتخاب دسته‌بندی الزامی است');
      return;
    }
    if (variants.length === 0) {
      toast.error('حداقل یک وریانت الزامی است');
      return;
    }
    const hasEmptyRequired = variants.some((v) => !v.sku || !v.price || !v.stock);
    if (hasEmptyRequired) {
      toast.error('کد SKU، قیمت و موجودی همه وریانت‌ها الزامی است');
      return;
    }

    setIsSaving(true);
    try {
      const formData = buildFormData();
      if (isEdit) {
        await updateProduct(product._id, formData);
        toast.success('محصول با موفقیت به‌روزرسانی شد');
      } else {
        await createProduct(formData);
        toast.success('محصول با موفقیت ایجاد شد');
      }
      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-ink-800/10 bg-white p-5">
        <h2 className="mb-4 text-sm font-bold text-ink-900">اطلاعات پایه</h2>

        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-ink-800/60">نام محصول *</label>
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-ink-800/60">دسته‌بندی *</label>
            <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="">انتخاب کنید</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-bold text-ink-800/60">توضیحات</label>
          <textarea
            className={`${inputClass} min-h-[100px] resize-none`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <label className="flex w-fit items-center gap-2 text-sm font-medium text-ink-800/70">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="h-4 w-4 accent-brand-500"
          />
          محصول ویژه (نمایش در بخش‌های خاص)
        </label>
      </div>

      <div className="rounded-xl border border-ink-800/10 bg-white p-5">
        <ImageManager
          productId={product?._id}
          existingImages={existingImages}
          onExistingImagesChange={setExistingImages}
          newFiles={newFiles}
          onNewFilesChange={setNewFiles}
          removingImage={removingImage}
          setRemovingImage={setRemovingImage}
        />
      </div>

      <div className="rounded-xl border border-ink-800/10 bg-white p-5">
        <VariantEditor variants={variants} onChange={setVariants} />
      </div>

      <div className="rounded-xl border border-ink-800/10 bg-white p-5">
        <SpecEditor specs={specs} onChange={setSpecs} />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-ink-800/15 px-5 py-2.5 text-sm font-bold text-ink-800/60 transition hover:bg-ink-100"
        >
          انصراف
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 rounded-md bg-brand-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600 disabled:opacity-60"
        >
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEdit ? 'ذخیره تغییرات' : 'ایجاد محصول'}
        </button>
      </div>
    </form>
  );
}