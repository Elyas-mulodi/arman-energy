'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-ink-100 px-4 text-center">
      <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
        <AlertTriangle className="h-6 w-6" />
      </span>
      <h1 className="mb-2 text-lg font-black text-ink-900">مشکلی پیش آمد</h1>
      <p className="mb-8 max-w-sm text-sm leading-6 text-ink-800/50">
        خطایی غیرمنتظره رخ داد. دوباره تلاش کنید؛ اگه مشکل ادامه داشت با ما تماس بگیرید.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="flex items-center justify-center gap-2 rounded-md bg-brand-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600"
        >
          <RefreshCw className="h-4 w-4" />
          تلاش مجدد
        </button>
        <Link
          href="/"
          className="rounded-md border border-ink-800/15 px-6 py-2.5 text-sm font-bold text-ink-800/70 transition hover:bg-ink-800/5"
        >
          صفحه اصلی
        </Link>
      </div>
    </div>
  );
}