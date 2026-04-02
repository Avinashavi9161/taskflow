'use client';

import { useRef } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { TaskFilters, TaskStatus, Priority } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  filters: TaskFilters;
  onFilter: (f: Partial<TaskFilters>) => void;
}

const STATUS_OPTS: { value: TaskStatus | ''; label: string }[] = [
  { value: '',            label: 'All Status' },
  { value: 'PENDING',     label: 'Pending' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED',   label: 'Completed' },
];

const PRIORITY_OPTS: { value: Priority | ''; label: string }[] = [
  { value: '',       label: 'All Priority' },
  { value: 'HIGH',   label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW',    label: 'Low' },
];

const SELECT_BASE =
  'bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all duration-200 cursor-pointer';

export default function TaskFiltersBar({ filters, onFilter }: Props) {
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (value: string) => {
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => onFilter({ search: value }), 400);
  };

  const hasActiveFilters = !!(filters.status || filters.priority || filters.search);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          defaultValue={filters.search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search tasks…"
          className="input-base pl-9 py-2"
        />
      </div>

      {/* Status */}
      <select
        value={filters.status ?? ''}
        onChange={(e) => onFilter({ status: e.target.value as TaskStatus | '' })}
        className={SELECT_BASE}
      >
        {STATUS_OPTS.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#12121e]">{o.label}</option>
        ))}
      </select>

      {/* Priority */}
      <select
        value={filters.priority ?? ''}
        onChange={(e) => onFilter({ priority: e.target.value as Priority | '' })}
        className={SELECT_BASE}
      >
        {PRIORITY_OPTS.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#12121e]">{o.label}</option>
        ))}
      </select>

      {/* Sort */}
      <select
        value={`${filters.sortBy ?? 'createdAt'}_${filters.order ?? 'desc'}`}
        onChange={(e) => {
          const [sortBy, order] = e.target.value.split('_');
          onFilter({ sortBy, order: order as 'asc' | 'desc' });
        }}
        className={SELECT_BASE}
      >
        <option value="createdAt_desc" className="bg-[#12121e]">Newest first</option>
        <option value="createdAt_asc"  className="bg-[#12121e]">Oldest first</option>
        <option value="dueDate_asc"    className="bg-[#12121e]">Due soonest</option>
        <option value="priority_asc"   className="bg-[#12121e]">Priority</option>
        <option value="title_asc"      className="bg-[#12121e]">A → Z</option>
      </select>

      {/* Clear */}
      {hasActiveFilters && (
        <button
          onClick={() => onFilter({ status: '', priority: '', search: '' })}
          className="btn-ghost text-xs gap-1.5 px-3 py-2"
        >
          <X size={13} /> Clear
        </button>
      )}
    </div>
  );
}
