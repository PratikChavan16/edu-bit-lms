/**
 * Courses API Service
 * All API calls related to courses management
 */

import { api } from '../api-client';

export interface Course {
  id: string;
  courseCode: string;
  courseName: string;
  departmentId: string;
  departmentName?: string;
  duration: number;
  type: 'theory' | 'practical' | 'lab';
  credits: number;
  description?: string;
  prerequisites?: string;
  facultyId?: string;
  facultyName?: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseFilters {
  search?: string;
  departmentId?: string;
  semester?: string;
  type?: string;
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

export const coursesApi = {
  // Get all courses with optional filters
  getAll: (filters?: CourseFilters) => 
    api.get<PaginatedResponse<Course>>('/courses', filters),

  // Get single course by ID
  getById: (id: string) => 
    api.get<{data: Course}>(`/courses/${id}`),

  // Create new course
  create: (data: Omit<Course, 'id' | 'departmentName' | 'facultyName' | 'createdAt' | 'updatedAt'>) => 
    api.post<{data: Course}>('/courses', data),

  // Update existing course
  update: (id: string, data: Partial<Omit<Course, 'id' | 'departmentName' | 'facultyName' | 'createdAt' | 'updatedAt'>>) => 
    api.put<{data: Course}>(`/courses/${id}`, data),

  // Delete course
  delete: (id: string) => 
    api.delete<{message: string}>(`/courses/${id}`),
};
