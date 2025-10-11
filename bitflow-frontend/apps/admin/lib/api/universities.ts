/**
 * Universities API Service
 * All API calls related to universities management
 */

import { api } from '../api-client';

export interface University {
  id: string;
  name: string;
  code: string;
  established: string;
  location: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface UniversityFilters {
  search?: string;
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

export const universitiesApi = {
  // Get all universities with optional filters
  getAll: (filters?: UniversityFilters) => 
    api.get<PaginatedResponse<University>>('/universities', filters),

  // Get single university by ID
  getById: (id: string) => 
    api.get<{data: University}>(`/universities/${id}`),

  // Create new university
  create: (data: Omit<University, 'id' | 'createdAt' | 'updatedAt'>) => 
    api.post<{data: University}>('/universities', data),

  // Update existing university
  update: (id: string, data: Partial<Omit<University, 'id' | 'createdAt' | 'updatedAt'>>) => 
    api.put<{data: University}>(`/universities/${id}`, data),

  // Delete university
  delete: (id: string) => 
    api.delete<{message: string}>(`/universities/${id}`),
};
