import { ProductSpecification } from '@/types/product';

export default function SpecsTable({ specs }: { specs: ProductSpecification[] }) {
  if (specs.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-md border border-ink-800/10">
      {specs.map((spec, i) => (
        <div
          key={spec.key + i}
          className={`flex justify-between px-4 py-2.5 text-sm ${
            i % 2 === 0 ? 'bg-ink-100/50' : ''
          }`}
        >
          <span className="text-ink-800/50">{spec.key}</span>
          <span className="font-medium text-ink-900">{spec.value}</span>
        </div>
      ))}
    </div>
  );
}