import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
}

export default function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-ink-800/15 bg-ink-800/[0.02] py-16 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-ink-800/5 text-ink-800/30">
        <Icon className="h-6 w-6" />
      </span>
      <p className="text-sm font-bold text-ink-800/70">{title}</p>
      {description && <p className="mt-1 text-xs text-ink-800/40">{description}</p>}
    </div>
  );
}