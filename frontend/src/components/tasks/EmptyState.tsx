import { ClipboardList, Plus } from 'lucide-react';

interface Props {
  hasFilters: boolean;
  onAdd: () => void;
}

export default function EmptyState({ hasFilters, onAdd }: Props) {
  return (
    <div className="glass rounded-2xl p-16 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-brand-500/10 ring-1 ring-brand-500/20 flex items-center justify-center mb-5">
        <ClipboardList size={28} className="text-brand-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-100 mb-2">
        {hasFilters ? 'No tasks match your filters' : 'No tasks yet'}
      </h3>
      <p className="text-sm text-slate-500 max-w-xs mb-6">
        {hasFilters
          ? 'Try adjusting your search or filter criteria.'
          : 'Create your first task to start organizing your work with clarity.'}
      </p>
      {!hasFilters && (
        <button onClick={onAdd} className="btn-primary">
          <Plus size={16} /> Create your first task
        </button>
      )}
    </div>
  );
}
