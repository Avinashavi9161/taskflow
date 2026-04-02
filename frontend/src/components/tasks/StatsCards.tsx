'use client';

import { CheckCircle2, Clock, Loader, ListTodo } from 'lucide-react';
import { TaskStats } from '@/types';

interface Props { stats: TaskStats | null; }

const cards = [
  { key: 'total',      label: 'Total',       icon: ListTodo,    color: 'text-slate-300',   ring: 'ring-slate-500/30',   bg: 'bg-slate-500/10' },
  { key: 'pending',    label: 'Pending',     icon: Clock,       color: 'text-amber-400',   ring: 'ring-amber-500/30',   bg: 'bg-amber-500/10' },
  { key: 'inProgress', label: 'In Progress', icon: Loader,      color: 'text-brand-400',   ring: 'ring-brand-500/30',   bg: 'bg-brand-500/10' },
  { key: 'completed',  label: 'Completed',   icon: CheckCircle2, color: 'text-emerald-400', ring: 'ring-emerald-500/30', bg: 'bg-emerald-500/10' },
] as const;

export default function StatsCards({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ key, label, icon: Icon, color, ring, bg }) => {
        const value = stats ? stats[key] : null;
        return (
          <div key={key} className="glass glass-hover rounded-2xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${bg} ring-1 ${ring} flex items-center justify-center`}>
                <Icon size={18} className={color} />
              </div>
              <span className={`text-2xl font-bold ${color}`}>
                {value !== null ? value : <span className="inline-block w-8 h-6 bg-white/5 rounded animate-pulse" />}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
          </div>
        );
      })}
    </div>
  );
}
