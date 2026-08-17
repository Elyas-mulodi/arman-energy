'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      value ? params.set('search', value) : params.delete('search');
      params.delete('page');
      router.push(`${pathname}?${params.toString()}`);
    }, 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="relative w-full md:w-64">
      <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-800/40" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="جستجوی محصول..."
        className="w-full rounded-md border border-ink-800/15 bg-white py-2 pr-9 pl-3 text-sm outline-none focus:border-brand-500"
      />
    </div>
  );
}