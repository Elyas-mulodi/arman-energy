import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  href?: string;
  tone?: 'default' | 'warning';
}

export default function StatCard({ icon: Icon, label, value, hint, href, tone = 'default' }: StatCardProps) {
  const isWarning = tone === 'warning';

  const content = (
    <div
      className={`h-full rounded-xl border p-5 transition ${
        isWarning ? 'border-amber-200 bg-amber-50/60' : 'border-ink-800/10 bg-white'
      } ${href ? 'hover:-translate-y-0.5 hover:shadow-md hover:shadow-ink-900/5' : ''}`}
    >
      <span
        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${
          isWarning ? 'bg-amber-100 text-amber-600' : 'bg-brand-500/10 text-brand-500'
        }`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <p className="text-xl font-black text-ink-900 sm:text-2xl">{value}</p>
      <p className="mt-1 text-xs text-ink-800/50">{label}</p>
      {hint && <p className="mt-2 text-[11px] font-bold text-ink-800/40">{hint}</p>}
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}