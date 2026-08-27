export default function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`rounded px-2 py-0.5 text-[11px] font-bold ${
        active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-ink-800/10 text-ink-800/50'
      }`}
    >
      {active ? 'فعال' : 'غیرفعال'}
    </span>
  );
}