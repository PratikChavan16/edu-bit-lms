/**
 * Batches API Service
 * All API calls related to batches management
 */

import { api } from '../api-client';

export interface Batch {
  id: string;
  batchYear: string;
  batchName: string;
  courseId: string;
  courseName?: string;
  startDate: string;
  endDate: string;
  currentSemester: number;
  totalStudents?: number;
  enrollmentCapacity: number;
  description?: string;
  status: 'active' | 'completed' | 'upcoming';
  createdAt?: string;
  updatedAt?: string;
}

export interface BatchFilters {
  search?: string;
  courseId?: string;
  status?: string;
  page?: number;
  perPage?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export const batchesApi = {
  // Get all batches with optional filters
  getAll: (filters?: BatchFilters) => 
    api.get<PaginatedResponse<Batch>>('/batches', filters),

  // Get single batch by ID
  getById: (id: string) => 
    api.get<{data: Batch}>(`/batches/${id}`),

  // Create new batch
  create: (data: Omit<Batch, 'id' | 'courseName' | 'totalStudents' | 'createdAt' | 'updatedAt'>) => 
    api.post<{data: Batch}>('/batches', data),

  // Update existing batch
  update: (id: string, data: Partial<Omit<Batch, 'id' | 'courseName' | 'totalStudents' | 'createdAt' | 'updatedAt'>>) => 
    api.put<{data: Batch}>(`/batches/${id}`, data),

  // Delete batch
  delete: (id: string) => 
    api.delete<{message: string}>(`/batches/${id}`),
};
