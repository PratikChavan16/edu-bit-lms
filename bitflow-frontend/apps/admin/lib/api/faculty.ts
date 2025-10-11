/**
 * Faculty API Service
 * All API calls related to faculty management
 */

import { api } from '../api-client';

export interface Faculty {
  id: string;
  facultyId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  qualification: string;
  specialization: string;
  experience: number;
  departmentId: string;
  departmentName?: string;
  designation: string;
  joiningDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  emergencyContact?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FacultyFilters {
  search?: string;
  departmentId?: string;
  collegeId?: string;
  status?: string;
  designation?: string;
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

export const facultyApi = {
  // Get all faculty with optional filters
  getAll: (filters?: FacultyFilters) => 
    api.get<PaginatedResponse<Faculty>>('/faculty', filters),

  // Get single faculty by ID
  getById: (id: string) => 
    api.get<{data: Faculty}>(`/faculty/${id}`),

  // Create new faculty
  create: (data: Omit<Faculty, 'id' | 'departmentName' | 'createdAt' | 'updatedAt'>) => 
    api.post<{data: Faculty}>('/faculty', data),

  // Update existing faculty
  update: (id: string, data: Partial<Omit<Faculty, 'id' | 'departmentName' | 'createdAt' | 'updatedAt'>>) => 
    api.put<{data: Faculty}>(`/faculty/${id}`, data),

  // Delete faculty
  delete: (id: string) => 
    api.delete<{message: string}>(`/faculty/${id}`),
};
