'use client';

import { Plus, Trash2 } from 'lucide-react';
import { VariantFormValue } from '@/types/product';

const inputClass =
  'w-full rounded-md border border-ink-800/15 bg-white px-2.5 py-2 text-xs outline-none focus:border-brand-500';

export default function VariantEditor({
  variants,
  onChange,
}: {
  variants: VariantFormValue[];
  onChange: (next: VariantFormValue[]) => void;
}) {
  const addVariant = () => {
    onChange([
      ...variants,
      { voltage: '', size: '', brand: '', sku: '', price: '', discountPrice: '', stock: '', isActive: true },
    ]);
  };

  const removeVariant = (index: number) => {
    onChange(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: keyof VariantFormValue, value: string | boolean) => {
    onChange(variants.map((v, i) => (i === index ? { ...v, [field]: value } : v)));
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <label className="text-xs font-bold text-ink-800/60">وریانت‌های محصول *</label>
        <button
          type="button"
          onClick={addVariant}
          className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline"
        >
          <Plus className="h-3.5 w-3.5" />
          افزودن وریانت
        </button>
      </div>

      {variants.length === 0 && (
        <p className="mb-3 rounded-md border border-dashed border-ink-800/15 py-6 text-center text-xs text-ink-800/40">
          حداقل یک وریانت الزامی است
        </p>
      )}

      <div className="space-y-3">
        {variants.map((variant, index) => (
          <div key={index} className="relative rounded-md border border-ink-800/10 bg-ink-100/40 p-3">
            <button
              type="button"
              onClick={() => removeVariant(index)}
              className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded text-ink-800/30 hover:bg-red-500/10 hover:text-red-500"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>

            <div className="grid grid-cols-2 gap-2 pl-8 sm:grid-cols-4">
              <div>
                <label className="mb-1 block text-[10px] text-ink-800/45">ولتاژ</label>
                <input
                  className={inputClass}
                  value={variant.voltage}
                  onChange={(e) => updateVariant(index, 'voltage', e.target.value)}
                  placeholder="220V"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] text-ink-800/45">سایز</label>
                <input
                  className={inputClass}
                  value={variant.size}
                  onChange={(e) => updateVariant(index, 'size', e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] text-ink-800/45">برند</label>
                <input
                  className={inputClass}
                  value={variant.brand}
                  onChange={(e) => updateVariant(index, 'brand', e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] text-ink-800/45">کد SKU *</label>
                <input
                  className={inputClass}
                  value={variant.sku}
                  onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] text-ink-800/45">قیمت (تومان) *</label>
                <input
                  type="number"
                  min="0"
                  className={inputClass}
                  value={variant.price}
                  onChange={(e) => updateVariant(index, 'price', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] text-ink-800/45">قیمت با تخفیف</label>
                <input
                  type="number"
                  min="0"
                  className={inputClass}
                  value={variant.discountPrice}
                  onChange={(e) => updateVariant(index, 'discountPrice', e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] text-ink-800/45">موجودی *</label>
                <input
                  type="number"
                  min="0"
                  className={inputClass}
                  value={variant.stock}
                  onChange={(e) => updateVariant(index, 'stock', e.target.value)}
                  required
                />
              </div>
              <div className="flex items-end pb-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-medium text-ink-800/60">
                  <input
                    type="checkbox"
                    checked={variant.isActive}
                    onChange={(e) => updateVariant(index, 'isActive', e.target.checked)}
                    className="h-3.5 w-3.5 accent-brand-500"
                  />
                  فعال
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}