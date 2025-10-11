/**
 * Subjects API Service
 * All API calls related to subjects management
 */

import { api } from '../api-client';

export interface Subject {
  id: string;
  subjectCode: string;
  subjectName: string;
  courseId: string;
  courseName?: string;
  type: 'theory' | 'practical';
  credits: number;
  hoursPerWeek: number;
  semester: number;
  facultyId: string;
  facultyName?: string;
  prerequisites?: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface SubjectFilters {
  search?: string;
  courseId?: string;
  type?: string;
  semester?: string;
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

export const subjectsApi = {
  // Get all subjects with optional filters
  getAll: (filters?: SubjectFilters) => 
    api.get<PaginatedResponse<Subject>>('/subjects', filters),

  // Get single subject by ID
  getById: (id: string) => 
    api.get<{data: Subject}>(`/subjects/${id}`),

  // Create new subject
  create: (data: Omit<Subject, 'id' | 'courseName' | 'facultyName' | 'createdAt' | 'updatedAt'>) => 
    api.post<{data: Subject}>('/subjects', data),

  // Update existing subject
  update: (id: string, data: Partial<Omit<Subject, 'id' | 'courseName' | 'facultyName' | 'createdAt' | 'updatedAt'>>) => 
    api.put<{data: Subject}>(`/subjects/${id}`, data),

  // Delete subject
  delete: (id: string) => 
    api.delete<{message: string}>(`/subjects/${id}`),
};
