import { ChevronRight, ChevronLeft } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-1.5">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-ink-800/10 text-ink-800/60 transition hover:bg-ink-800/5 disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="صفحه قبل"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {start > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-sm text-ink-800/60 hover:bg-ink-800/5"
          >
            1
          </button>
          {start > 2 && <span className="px-1 text-ink-800/30">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`flex h-9 w-9 items-center justify-center rounded-md text-sm font-bold transition ${
            page === currentPage
              ? 'bg-brand-500 text-white'
              : 'text-ink-800/60 hover:bg-ink-800/5'
          }`}
        >
          {page}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-ink-800/30">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-sm text-ink-800/60 hover:bg-ink-800/5"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-ink-800/10 text-ink-800/60 transition hover:bg-ink-800/5 disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="صفحه بعد"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
    </div>
  );
}