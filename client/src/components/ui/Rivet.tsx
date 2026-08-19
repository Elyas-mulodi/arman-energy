export default function Rivet({ className = '' }: { className?: string }) {
  return (
    <div className={`h-2 w-2 rounded-full bg-ink-700 ${className}`}>
      <div className="mt-[3px] ml-[1px] h-[1px] w-1 bg-ink-900/50" />
    </div>
  );
}