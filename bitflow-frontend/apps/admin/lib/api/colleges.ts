/**
 * Colleges API Service
 * All API calls related to colleges management
 */

import { api } from '../api-client';

export interface College {
  id: string;
  name: string;
  code: string;
  universityId: string;
  universityName?: string;
  established: string;
  location: string;
  dean: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface CollegeFilters {
  search?: string;
  universityId?: string;
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

export const collegesApi = {
  // Get all colleges with optional filters
  getAll: (filters?: CollegeFilters) => 
    api.get<PaginatedResponse<College>>('/colleges', filters),

  // Get single college by ID
  getById: (id: string) => 
    api.get<{data: College}>(`/colleges/${id}`),

  // Create new college
  create: (data: Omit<College, 'id' | 'universityName' | 'createdAt' | 'updatedAt'>) => 
    api.post<{data: College}>('/colleges', data),

  // Update existing college
  update: (id: string, data: Partial<Omit<College, 'id' | 'universityName' | 'createdAt' | 'updatedAt'>>) => 
    api.put<{data: College}>(`/colleges/${id}`, data),

  // Delete college
  delete: (id: string) => 
    api.delete<{message: string}>(`/colleges/${id}`),
};
