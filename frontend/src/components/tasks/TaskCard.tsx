'use client';

import { useState } from 'react';
import { Calendar, Check, Edit2, Trash2, AlertCircle, ChevronRight } from 'lucide-react';
import { Task } from '@/types';
import { cn, PRIORITY_CONFIG, STATUS_CONFIG, formatDueDate, isDueDateOverdue } from '@/lib/utils';

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onToggle, onEdit, onDelete }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const isCompleted = task.status === 'COMPLETED';
  const overdue = isDueDateOverdue(task.dueDate, task.status);
  const priority = PRIORITY_CONFIG[task.priority];
  const status = STATUS_CONFIG[task.status];

  const handleDelete = async () => {
    if (!confirm('Delete this task?')) return;
    setIsDeleting(true);
    try { await onDelete(task.id); }
    finally { setIsDeleting(false); }
  };

  return (
    <div className={cn(
      'glass glass-hover rounded-2xl p-5 group relative overflow-hidden',
      isCompleted && 'opacity-60',
    )}>
      {/* Priority accent bar */}
      <div className={cn(
        'absolute left-0 top-4 bottom-4 w-0.5 rounded-r-full transition-all duration-300 group-hover:w-1',
        task.priority === 'HIGH'   && 'bg-rose-500',
        task.priority === 'MEDIUM' && 'bg-amber-500',
        task.priority === 'LOW'    && 'bg-emerald-500',
      )} />

      <div className="flex items-start gap-3 pl-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className={cn(
            'mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200',
            isCompleted
              ? 'bg-emerald-500 border-emerald-500'
              : 'border-white/20 hover:border-brand-400',
          )}
          aria-label="Toggle task"
        >
          {isCompleted && <Check size={11} className="text-white" strokeWidth={3} />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className={cn(
              'font-semibold text-sm text-slate-100 leading-snug',
              isCompleted && 'line-through text-slate-500',
            )}>
              {task.title}
            </h3>

            {/* Actions — visible on hover */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button onClick={() => onEdit(task)} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-brand-400 transition-colors" aria-label="Edit">
                <Edit2 size={13} />
              </button>
              <button onClick={handleDelete} disabled={isDeleting} className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors" aria-label="Delete">
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {task.description && (
            <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">{task.description}</p>
          )}

          {/* Footer meta */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status badge */}
            <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border', status.bg, status.color)}>
              {status.label}
            </span>

            {/* Priority dot */}
            <span className={cn('inline-flex items-center gap-1.5 text-[11px] font-medium', priority.color)}>
              <span className={cn('w-1.5 h-1.5 rounded-full', priority.dot)} />
              {priority.label}
            </span>

            {/* Due date */}
            {task.dueDate && (
              <span className={cn(
                'inline-flex items-center gap-1 text-[11px] font-medium ml-auto',
                overdue ? 'text-rose-400' : 'text-slate-500',
              )}>
                {overdue ? <AlertCircle size={11} /> : <Calendar size={11} />}
                {formatDueDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
