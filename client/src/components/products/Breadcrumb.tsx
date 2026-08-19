import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="mb-6 flex items-center gap-1.5 text-xs text-ink-800/50">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {item.href ? (
            <Link href={item.href} className="hover:text-brand-600">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-ink-800">{item.label}</span>
          )}
          {i < items.length - 1 && <ChevronLeft className="h-3 w-3" />}
        </span>
      ))}
    </nav>
  );
}