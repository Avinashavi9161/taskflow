import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns';
import { Priority, TaskStatus } from '@/types';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatDueDate = (date: string | null | undefined): string => {
  if (!date) return '';
  const d = parseISO(date);
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  return format(d, 'MMM d, yyyy');
};

export const isDueDateOverdue = (date: string | null | undefined, status: TaskStatus): boolean => {
  if (!date || status === 'COMPLETED') return false;
  return isPast(parseISO(date));
};

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; dot: string }> = {
  HIGH:   { label: 'High',   color: 'text-rose-400',   dot: 'bg-rose-400' },
  MEDIUM: { label: 'Medium', color: 'text-amber-400',  dot: 'bg-amber-400' },
  LOW:    { label: 'Low',    color: 'text-emerald-400', dot: 'bg-emerald-400' },
};

export const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  PENDING:     { label: 'Pending',     color: 'text-slate-400',   bg: 'bg-slate-400/10 border-slate-400/20' },
  IN_PROGRESS: { label: 'In Progress', color: 'text-brand-400',   bg: 'bg-brand-400/10 border-brand-400/20' },
  COMPLETED:   { label: 'Completed',   color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
};

export const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosErr = error as { response?: { data?: { message?: string } } };
    return axiosErr.response?.data?.message ?? 'Something went wrong.';
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred.';
};
