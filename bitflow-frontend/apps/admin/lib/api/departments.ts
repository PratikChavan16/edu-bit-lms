/**
 * Departments API Service
 * All API calls related to departments management
 */

import { api } from '../api-client';

export interface Department {
  id: string;
  name: string;
  code: string;
  collegeId: string;
  collegeName?: string;
  hod: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface DepartmentFilters {
  search?: string;
  collegeId?: string;
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

export const departmentsApi = {
  // Get all departments with optional filters
  getAll: (filters?: DepartmentFilters) => 
    api.get<PaginatedResponse<Department>>('/departments', filters),

  // Get single department by ID
  getById: (id: string) => 
    api.get<{data: Department}>(`/departments/${id}`),

  // Create new department
  create: (data: Omit<Department, 'id' | 'collegeName' | 'createdAt' | 'updatedAt'>) => 
    api.post<{data: Department}>('/departments', data),

  // Update existing department
  update: (id: string, data: Partial<Omit<Department, 'id' | 'collegeName' | 'createdAt' | 'updatedAt'>>) => 
    api.put<{data: Department}>(`/departments/${id}`, data),

  // Delete department
  delete: (id: string) => 
    api.delete<{message: string}>(`/departments/${id}`),
};
