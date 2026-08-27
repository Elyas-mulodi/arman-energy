import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: string;
}

export default function StatCard({ icon: Icon, label, value, trend }: StatCardProps) {
  return (
    <div className="min-w-0 rounded-xl border border-ink-800/10 bg-white p-3.5 sm:p-5">
      <div className="mb-2 flex items-center justify-between sm:mb-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500 sm:h-10 sm:w-10">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </span>
        {trend && (
          <span className="shrink-0 text-[11px] font-bold text-emerald-500 sm:text-xs">{trend}</span>
        )}
      </div>
      <p className="truncate text-lg font-black text-ink-900 sm:text-2xl" title={value}>
        {value}
      </p>
      <p className="mt-0.5 truncate text-[11px] text-ink-800/50 sm:mt-1 sm:text-xs">{label}</p>
    </div>
  );
}