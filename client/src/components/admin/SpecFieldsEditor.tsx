'use client';

import { Plus, Trash2 } from 'lucide-react';
import { SpecDraft } from '@/types/productForm';

interface SpecFieldsEditorProps {
  specs: SpecDraft[];
  onChange: (specs: SpecDraft[]) => void;
}

export default function SpecFieldsEditor({ specs, onChange }: SpecFieldsEditorProps) {
  const updateSpec = (index: number, field: keyof SpecDraft, value: string) => {
    onChange(specs.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const addSpec = () => onChange([...specs, { key: '', value: '' }]);
  const removeSpec = (index: number) => onChange(specs.filter((_, i) => i !== index));

  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <label className="text-xs font-bold text-ink-800/60">مشخصات فنی (اختیاری)</label>
        <button
          type="button"
          onClick={addSpec}
          className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline"
        >
          <Plus className="h-3.5 w-3.5" />
          افزودن مشخصه
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {specs.map((spec, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              placeholder="عنوان (مثلا دور موتور)"
              value={spec.key}
              onChange={(e) => updateSpec(index, 'key', e.target.value)}
              className="flex-1 rounded-md border border-ink-800/15 bg-white px-3 py-2 text-xs outline-none focus:border-brand-500"
            />
            <input
              placeholder="مقدار (مثلا 1500 دور)"
              value={spec.value}
              onChange={(e) => updateSpec(index, 'value', e.target.value)}
              className="flex-1 rounded-md border border-ink-800/15 bg-white px-3 py-2 text-xs outline-none focus:border-brand-500"
            />
            <button
              type="button"
              onClick={() => removeSpec(index)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-red-400 hover:bg-red-50"
              aria-label="حذف"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}