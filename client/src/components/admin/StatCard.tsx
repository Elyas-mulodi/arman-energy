import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: string;
}

export default function StatCard({ icon: Icon, label, value, trend }: StatCardProps) {
  return (
    <div className="rounded-xl border border-ink-800/10 bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500">
          <Icon className="h-5 w-5" />
        </span>
        {trend && <span className="text-xs font-bold text-emerald-500">{trend}</span>}
      </div>
      <p className="text-2xl font-black text-ink-900">{value}</p>
      <p className="mt-1 text-xs text-ink-800/50">{label}</p>
    </div>
  );
}