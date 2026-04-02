import { Request } from 'express';
import { TaskStatus, Priority } from '@prisma/client';

// ─── Auth ──────────────────────────────────────────────────────────────────────

export interface TokenPayload {
  sub: string;   // user id
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user: TokenPayload;
}

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

// ─── Task ─────────────────────────────────────────────────────────────────────

export interface CreateTaskBody {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  dueDate?: string;
}

export interface UpdateTaskBody extends Partial<CreateTaskBody> {}

export interface TaskQueryParams {
  page?: string;
  limit?: string;
  status?: TaskStatus;
  priority?: Priority;
  search?: string;
  sortBy?: 'createdAt' | 'dueDate' | 'priority' | 'title';
  order?: 'asc' | 'desc';
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
