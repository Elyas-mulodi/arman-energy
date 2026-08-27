'use client';

import { Plus, X } from 'lucide-react';
import { SpecFormValue } from '@/types/product';

export default function SpecEditor({
  specs,
  onChange,
}: {
  specs: SpecFormValue[];
  onChange: (next: SpecFormValue[]) => void;
}) {
  const addSpec = () => onChange([...specs, { key: '', value: '' }]);
  const removeSpec = (index: number) => onChange(specs.filter((_, i) => i !== index));
  const updateSpec = (index: number, field: keyof SpecFormValue, value: string) =>
    onChange(specs.map((s, i) => (i === index ? { ...s, [field]: value } : s)));

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <label className="text-xs font-bold text-ink-800/60">مشخصات فنی</label>
        <button
          type="button"
          onClick={addSpec}
          className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline"
        >
          <Plus className="h-3.5 w-3.5" />
          افزودن مشخصه
        </button>
      </div>

      <div className="space-y-2">
        {specs.map((spec, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              value={spec.key}
              onChange={(e) => updateSpec(index, 'key', e.target.value)}
              placeholder="عنوان (مثلاً توان)"
              className="w-1/3 rounded-md border border-ink-800/15 bg-white px-2.5 py-2 text-xs outline-none focus:border-brand-500"
            />
            <input
              value={spec.value}
              onChange={(e) => updateSpec(index, 'value', e.target.value)}
              placeholder="مقدار (مثلاً ۱۵۰۰ وات)"
              className="flex-1 rounded-md border border-ink-800/15 bg-white px-2.5 py-2 text-xs outline-none focus:border-brand-500"
            />
            <button
              type="button"
              onClick={() => removeSpec(index)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-ink-800/30 hover:bg-red-500/10 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}