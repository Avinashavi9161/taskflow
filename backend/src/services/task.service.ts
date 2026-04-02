import { PrismaClient, TaskStatus, Priority } from '@prisma/client';
import { CreateTaskBody, UpdateTaskBody, TaskQueryParams, PaginationMeta } from '../types';

const prisma = new PrismaClient();

const PRIORITY_ORDER = { HIGH: 0, MEDIUM: 1, LOW: 2 };

export const taskService = {
  async getAll(userId: string, query: TaskQueryParams) {
    const page = Math.max(1, parseInt(query.page ?? '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(query.limit ?? '10', 10)));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { userId };

    if (query.status) where.status = query.status;
    if (query.priority) where.priority = query.priority;
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const orderBy = buildOrderBy(query.sortBy ?? 'createdAt', query.order ?? 'desc');

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({ where, orderBy, skip, take: limit }),
      prisma.task.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const meta: PaginationMeta = {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    return { tasks, meta };
  },

  async getById(id: string, userId: string) {
    const task = await prisma.task.findFirst({ where: { id, userId } });
    if (!task) {
      const err = new Error('Task not found.') as Error & { status: number };
      err.status = 404;
      throw err;
    }
    return task;
  },

  async create(userId: string, data: CreateTaskBody) {
    return prisma.task.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        status: data.status ?? 'PENDING',
        priority: data.priority ?? 'MEDIUM',
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
    });
  },

  async update(id: string, userId: string, data: UpdateTaskBody) {
    await taskService.getById(id, userId); // assert ownership

    return prisma.task.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.priority !== undefined && { priority: data.priority }),
        ...(data.dueDate !== undefined && { dueDate: data.dueDate ? new Date(data.dueDate) : null }),
      },
    });
  },

  async delete(id: string, userId: string) {
    await taskService.getById(id, userId); // assert ownership
    await prisma.task.delete({ where: { id } });
  },

  async toggle(id: string, userId: string) {
    const task = await taskService.getById(id, userId);
    const nextStatus: TaskStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    return prisma.task.update({ where: { id }, data: { status: nextStatus } });
  },

  async getStats(userId: string) {
    const [total, pending, inProgress, completed] = await Promise.all([
      prisma.task.count({ where: { userId } }),
      prisma.task.count({ where: { userId, status: 'PENDING' } }),
      prisma.task.count({ where: { userId, status: 'IN_PROGRESS' } }),
      prisma.task.count({ where: { userId, status: 'COMPLETED' } }),
    ]);
    return { total, pending, inProgress, completed };
  },
};

function buildOrderBy(sortBy: string, order: string) {
  const dir = (order === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc';
  switch (sortBy) {
    case 'dueDate':  return { dueDate: dir };
    case 'title':    return { title: dir };
    case 'priority': return { priority: dir };
    default:         return { createdAt: dir };
  }
}
