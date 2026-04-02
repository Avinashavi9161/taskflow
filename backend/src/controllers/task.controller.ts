import { Request, Response } from 'express';
import { taskService } from '../services/task.service';
import { AuthenticatedRequest, TaskQueryParams } from '../types';

export const taskController = {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user.sub;
      const query = req.query as TaskQueryParams;
      const { tasks, meta } = await taskService.getAll(userId, query);
      res.json({ success: true, message: 'Tasks retrieved.', data: tasks, meta });
    } catch (err: any) {
      res.status(err.status ?? 500).json({ success: false, message: err.message });
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user.sub;
      const task = await taskService.getById(req.params.id, userId);
      res.json({ success: true, message: 'Task retrieved.', data: task });
    } catch (err: any) {
      res.status(err.status ?? 500).json({ success: false, message: err.message });
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user.sub;
      const task = await taskService.create(userId, req.body);
      res.status(201).json({ success: true, message: 'Task created.', data: task });
    } catch (err: any) {
      res.status(err.status ?? 500).json({ success: false, message: err.message });
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user.sub;
      const task = await taskService.update(req.params.id, userId, req.body);
      res.json({ success: true, message: 'Task updated.', data: task });
    } catch (err: any) {
      res.status(err.status ?? 500).json({ success: false, message: err.message });
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user.sub;
      await taskService.delete(req.params.id, userId);
      res.json({ success: true, message: 'Task deleted.' });
    } catch (err: any) {
      res.status(err.status ?? 500).json({ success: false, message: err.message });
    }
  },

  async toggle(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user.sub;
      const task = await taskService.toggle(req.params.id, userId);
      res.json({ success: true, message: 'Task status updated.', data: task });
    } catch (err: any) {
      res.status(err.status ?? 500).json({ success: false, message: err.message });
    }
  },

  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user.sub;
      const stats = await taskService.getStats(userId);
      res.json({ success: true, message: 'Stats retrieved.', data: stats });
    } catch (err: any) {
      res.status(err.status ?? 500).json({ success: false, message: err.message });
    }
  },
};
