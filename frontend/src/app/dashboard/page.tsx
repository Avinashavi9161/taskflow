'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { useTasks } from '@/hooks/useTasks';
import { getErrorMessage } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import StatsCards from '@/components/tasks/StatsCards';
import TaskFiltersBar from '@/components/tasks/TaskFiltersBar';
import TaskCard from '@/components/tasks/TaskCard';
import TaskFormModal from '@/components/tasks/TaskFormModal';
import Pagination from '@/components/tasks/Pagination';
import EmptyState from '@/components/tasks/EmptyState';
import { Task, CreateTaskInput } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  const [modalOpen, setModalOpen]     = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const {
    tasks, meta, stats, filters, isLoading,
    fetchTasks, createTask, updateTask, deleteTask, toggleTask,
    applyFilters, goToPage,
  } = useTasks();

  // Auth guard
  useEffect(() => {
    if (!isAuthenticated) router.replace('/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const handleSave = async (data: CreateTaskInput) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, data);
      } else {
        await createTask(data);
      }
      setEditingTask(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err; // keep modal open
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const openCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const hasFilters = !!(filters.status || filters.priority || filters.search);

  return (
    <>
      <div className="min-h-screen bg-[#07070f]">
        {/* Ambient orbs */}
        <div className="fixed orb w-[600px] h-[600px] bg-brand-900/40 top-[-200px] right-[-200px] pointer-events-none" />
        <div className="fixed orb w-[400px] h-[400px] bg-violet-900/30 bottom-[-100px] left-[-100px] pointer-events-none" />
        <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none" />

        <Navbar />

        <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-brand-400 uppercase tracking-widest mb-1">Dashboard</p>
              <h1 className="text-3xl font-bold text-white leading-tight">
                Good {getGreeting()},{' '}
                <span className="bg-gradient-to-r from-brand-400 to-violet-400 bg-clip-text text-transparent">
                  {user?.name.split(' ')[0]}
                </span>
              </h1>
              <p className="text-slate-500 text-sm mt-1">Here&apos;s what&apos;s on your plate today.</p>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => { fetchTasks(); }} className="btn-ghost p-2.5" aria-label="Refresh">
                <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              </button>
              <button onClick={openCreate} className="btn-primary">
                <Plus size={16} /> New Task
              </button>
            </div>
          </div>

          {/* Stats */}
          <StatsCards stats={stats} />

          {/* Task list */}
          <div className="glass rounded-2xl p-6 space-y-5">
            {/* Filters */}
            <TaskFiltersBar filters={filters} onFilter={applyFilters} />

            {/* Count */}
            {meta && (
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 font-medium">
                  {meta.total} task{meta.total !== 1 ? 's' : ''}
                  {hasFilters ? ' matching filters' : ' total'}
                </p>
              </div>
            )}

            {/* Cards */}
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-24 rounded-2xl bg-white/3 border border-white/6 animate-pulse" />
                ))}
              </div>
            ) : tasks.length === 0 ? (
              <EmptyState hasFilters={hasFilters} onAdd={openCreate} />
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onEdit={handleEdit}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {meta && <Pagination meta={meta} onPageChange={goToPage} />}
          </div>
        </main>
      </div>

      {/* Modal */}
      <TaskFormModal
        open={modalOpen}
        task={editingTask}
        onClose={() => { setModalOpen(false); setEditingTask(null); }}
        onSave={handleSave}
      />
    </>
  );
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
