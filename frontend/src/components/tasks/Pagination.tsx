'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationMeta } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export default function Pagination({ meta, onPageChange }: Props) {
  const { page, totalPages, total, limit } = meta;
  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to   = Math.min(page * limit, total);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
      <p className="text-xs text-slate-500">
        Showing <span className="text-slate-300 font-medium">{from}–{to}</span> of{' '}
        <span className="text-slate-300 font-medium">{total}</span> tasks
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!meta.hasPrevPage}
          className="btn-ghost px-2.5 py-2 disabled:opacity-30"
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((p, i) => {
          const prev = pages[i - 1];
          return (
            <span key={p} className="flex items-center gap-1">
              {prev && p - prev > 1 && <span className="text-slate-600 px-1">…</span>}
              <button
                onClick={() => onPageChange(p)}
                className={cn(
                  'w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200',
                  p === page
                    ? 'bg-brand-600 text-white shadow-glow-sm'
                    : 'text-slate-400 hover:bg-white/8 hover:text-slate-100',
                )}
              >
                {p}
              </button>
            </span>
          );
        })}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!meta.hasNextPage}
          className="btn-ghost px-2.5 py-2 disabled:opacity-30"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
