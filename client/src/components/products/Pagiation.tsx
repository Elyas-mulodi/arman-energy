'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export default function Pagination({
  pagination,
}: {
  pagination: { total: number; page: number; pages: number };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (pagination.pages <= 1) return null;

  const goTo = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        onClick={() => goTo(pagination.page - 1)}
        disabled={pagination.page <= 1}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-ink-800/15 disabled:opacity-30"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
      <span className="text-sm text-ink-800/70">
        صفحه {pagination.page.toLocaleString('fa-IR')} از {pagination.pages.toLocaleString('fa-IR')}
      </span>
      <button
        onClick={() => goTo(pagination.page + 1)}
        disabled={pagination.page >= pagination.pages}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-ink-800/15 disabled:opacity-30"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
    </div>
  );
}