import { PackageSearch } from 'lucide-react';

export default function CategoriesEmpty() {
  return (
    <div className="flex h-72 flex-col items-center justify-center gap-3 rounded-md border border-dashed border-ink-800/15 text-center">
      <PackageSearch className="h-8 w-8 text-ink-800/25" strokeWidth={1.5} />
      <p className="text-sm text-ink-800/40">هنوز دسته‌بندی‌ای ثبت نشده است</p>
    </div>
  );
}