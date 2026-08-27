'use client';

import { Plus, Trash2 } from 'lucide-react';
import { VariantDraft, emptyVariant } from '@/types/productForm';

interface VariantFieldsEditorProps {
  variants: VariantDraft[];
  onChange: (variants: VariantDraft[]) => void;
}

export default function VariantFieldsEditor({ variants, onChange }: VariantFieldsEditorProps) {
  const updateVariant = (index: number, field: keyof VariantDraft, value: string | boolean) => {
    const updated = variants.map((v, i) => (i === index ? { ...v, [field]: value } : v));
    onChange(updated);
  };

  const addVariant = () => {
    onChange([...variants, { ...emptyVariant }]);
  };

  const removeVariant = (index: number) => {
    onChange(variants.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <label className="text-xs font-bold text-ink-800/60">وریانت‌ها (ولتاژ/سایز/برند)</label>
        <button
          type="button"
          onClick={addVariant}
          className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline"
        >
          <Plus className="h-3.5 w-3.5" />
          افزودن وریانت
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {variants.map((variant, index) => (
          <div key={index} className="rounded-lg border border-ink-800/10 bg-ink-100/40 p-4">
            <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              <input
                placeholder="ولتاژ (مثلا 220V)"
                value={variant.voltage}
                onChange={(e) => updateVariant(index, 'voltage', e.target.value)}
                className="rounded-md border border-ink-800/15 bg-white px-3 py-2 text-xs outline-none focus:border-brand-500"
              />
              <input
                placeholder="سایز (مثلا 1HP)"
                value={variant.size}
                onChange={(e) => updateVariant(index, 'size', e.target.value)}
                className="rounded-md border border-ink-800/15 bg-white px-3 py-2 text-xs outline-none focus:border-brand-500"
              />
              <input
                placeholder="برند"
                value={variant.brand}
                onChange={(e) => updateVariant(index, 'brand', e.target.value)}
                className="rounded-md border border-ink-800/15 bg-white px-3 py-2 text-xs outline-none focus:border-brand-500"
              />
            </div>

            <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <input
                placeholder="SKU (اجباری، یکتا)"
                value={variant.sku}
                onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                required
                className="rounded-md border border-ink-800/15 bg-white px-3 py-2 text-xs outline-none focus:border-brand-500"
              />
              <input
                type="number"
                placeholder="قیمت (تومان)"
                value={variant.price}
                onChange={(e) => updateVariant(index, 'price', e.target.value)}
                required
                min="0"
                className="rounded-md border border-ink-800/15 bg-white px-3 py-2 text-xs outline-none focus:border-brand-500"
              />
              <input
                type="number"
                placeholder="قیمت تخفیف (اختیاری)"
                value={variant.discountPrice}
                onChange={(e) => updateVariant(index, 'discountPrice', e.target.value)}
                min="0"
                className="rounded-md border border-ink-800/15 bg-white px-3 py-2 text-xs outline-none focus:border-brand-500"
              />
              <input
                type="number"
                placeholder="موجودی"
                value={variant.stock}
                onChange={(e) => updateVariant(index, 'stock', e.target.value)}
                required
                min="0"
                className="rounded-md border border-ink-800/15 bg-white px-3 py-2 text-xs outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs text-ink-800/60">
                <input
                  type="checkbox"
                  checked={variant.isActive}
                  onChange={(e) => updateVariant(index, 'isActive', e.target.checked)}
                  className="accent-brand-500"
                />
                فعال
              </label>

              {variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="flex items-center gap-1 text-xs text-red-500 hover:underline"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  حذف این وریانت
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}