'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2 } from 'lucide-react';
import { Task, CreateTaskInput, TaskStatus, Priority } from '@/types';
import { cn } from '@/lib/utils';

const schema = z.object({
  title:       z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional(),
  status:      z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
  priority:    z.enum(['LOW', 'MEDIUM', 'HIGH']),
  dueDate:     z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  task?: Task | null;
  onClose: () => void;
  onSave: (data: CreateTaskInput) => Promise<void>;
}

const FIELD_LABEL = 'block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2';
const SELECT = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all duration-200 cursor-pointer';

export default function TaskFormModal({ open, task, onClose, onSave }: Props) {
  const isEdit = !!task;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'PENDING', priority: 'MEDIUM' },
  });

  useEffect(() => {
    if (open) {
      reset(task
        ? {
            title:       task.title,
            description: task.description ?? '',
            status:      task.status,
            priority:    task.priority,
            dueDate:     task.dueDate ? task.dueDate.slice(0, 10) : '',
          }
        : { title: '', description: '', status: 'PENDING', priority: 'MEDIUM', dueDate: '' },
      );
    }
  }, [open, task, reset]);

  if (!open) return null;

  const onSubmit = async (data: FormData) => {
    await onSave({
      title:       data.title,
      description: data.description || undefined,
      status:      data.status as TaskStatus,
      priority:    data.priority as Priority,
      dueDate:     data.dueDate || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg glass rounded-2xl shadow-glass animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-white/8">
          <div>
            <h2 className="text-lg font-bold text-white">{isEdit ? 'Edit task' : 'New task'}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{isEdit ? 'Update the details below.' : 'Fill in the details to create a new task.'}</p>
          </div>
          <button onClick={onClose} className="btn-ghost p-2 rounded-lg"><X size={18} /></button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className={FIELD_LABEL}>Title *</label>
            <input {...register('title')} placeholder="What needs to be done?" className="input-base" autoFocus />
            {errors.title && <p className="mt-1.5 text-xs text-rose-400">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className={FIELD_LABEL}>Description</label>
            <textarea
              {...register('description')}
              placeholder="Add more context…"
              rows={3}
              className="input-base resize-none"
            />
          </div>

          {/* Status + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={FIELD_LABEL}>Status</label>
              <select {...register('status')} className={SELECT}>
                <option value="PENDING"     className="bg-[#12121e]">Pending</option>
                <option value="IN_PROGRESS" className="bg-[#12121e]">In Progress</option>
                <option value="COMPLETED"   className="bg-[#12121e]">Completed</option>
              </select>
            </div>
            <div>
              <label className={FIELD_LABEL}>Priority</label>
              <select {...register('priority')} className={SELECT}>
                <option value="HIGH"   className="bg-[#12121e]">🔴 High</option>
                <option value="MEDIUM" className="bg-[#12121e]">🟡 Medium</option>
                <option value="LOW"    className="bg-[#12121e]">🟢 Low</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className={FIELD_LABEL}>Due Date</label>
            <input {...register('dueDate')} type="date" className="input-base" />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1 py-2.5 justify-center border border-white/10">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 py-2.5">
              {isSubmitting ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : isEdit ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
