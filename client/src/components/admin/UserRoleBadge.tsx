import { UserRole } from '@/types/user';

export default function UserRoleBadge({ role }: { role: UserRole }) {
  const isAdmin = role === 'admin';
  return (
    <span
      className={`rounded px-2 py-1 text-[11px] font-bold ${
        isAdmin ? 'bg-brand-500/10 text-brand-600' : 'bg-ink-800/5 text-ink-800/50'
      }`}
    >
      {isAdmin ? 'ادمین' : 'مشتری'}
    </span>
  );
}