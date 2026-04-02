'use client';

import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { tasksApi } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils';
import { Task, TaskFilters, PaginationMeta, TaskStats, CreateTaskInput } from '@/types';

export function useTasks(initialFilters: TaskFilters = {}) {
  const [tasks, setTasks]       = useState<Task[]>([]);
  const [meta, setMeta]         = useState<PaginationMeta | null>(null);
  const [stats, setStats]       = useState<TaskStats | null>(null);
  const [filters, setFilters]   = useState<TaskFilters>({ page: 1, limit: 10, ...initialFilters });
  const [isLoading, setLoading] = useState(false);

  const fetchTasks = useCallback(async (f: TaskFilters = filters) => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = {};
      if (f.search)   params.search   = f.search;
      if (f.status)   params.status   = f.status;
      if (f.priority) params.priority = f.priority;
      if (f.sortBy)   params.sortBy   = f.sortBy;
      if (f.order)    params.order    = f.order;
      params.page  = f.page  ?? 1;
      params.limit = f.limit ?? 10;

      const res = await tasksApi.getAll(params);
      setTasks(res.data.data);
      setMeta(res.data.meta ?? null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await tasksApi.getStats();
      setStats(res.data.data);
    } catch { /* silent */ }
  }, []);

  const createTask = useCallback(async (data: CreateTaskInput) => {
    const res = await tasksApi.create(data);
    toast.success('Task created!');
    await Promise.all([fetchTasks(), fetchStats()]);
    return res.data.data as Task;
  }, [fetchTasks, fetchStats]);

  const updateTask = useCallback(async (id: string, data: Partial<CreateTaskInput>) => {
    const res = await tasksApi.update(id, data);
    setTasks((prev) => prev.map((t) => (t.id === id ? res.data.data : t)));
    await fetchStats();
    toast.success('Task updated!');
    return res.data.data as Task;
  }, [fetchStats]);

  const deleteTask = useCallback(async (id: string) => {
    await tasksApi.delete(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await fetchStats();
    toast.success('Task deleted.');
  }, [fetchStats]);

  const toggleTask = useCallback(async (id: string) => {
    const res = await tasksApi.toggle(id);
    const updated = res.data.data as Task;
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    await fetchStats();
    toast.success(updated.status === 'COMPLETED' ? 'Marked complete! ✓' : 'Marked incomplete.');
    return updated;
  }, [fetchStats]);

  const applyFilters = useCallback((newFilters: Partial<TaskFilters>) => {
    const merged = { ...filters, ...newFilters, page: 1 };
    setFilters(merged);
    fetchTasks(merged);
  }, [filters, fetchTasks]);

  const goToPage = useCallback((page: number) => {
    const merged = { ...filters, page };
    setFilters(merged);
    fetchTasks(merged);
  }, [filters, fetchTasks]);

  useEffect(() => { fetchTasks(); fetchStats(); }, []);

  return { tasks, meta, stats, filters, isLoading, fetchTasks, fetchStats, createTask, updateTask, deleteTask, toggleTask, applyFilters, goToPage };
}
