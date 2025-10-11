/**
 * Students API Service
 * All API calls related to students management
 */

import { api } from '../api-client';

export interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  city: string;
  state: string;
  zipCode: string;
  collegeId: string;
  collegeName?: string;
  departmentId: string;
  departmentName?: string;
  batch: string;
  semester: number;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated' | 'suspended';
  gpa?: number;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  emergencyContact?: string;
  bloodGroup?: string;
  nationality?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentFilters {
  search?: string;
  collegeId?: string;
  departmentId?: string;
  batch?: string;
  status?: string;
  semester?: string;
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

export const studentsApi = {
  // Get all students with optional filters
  getAll: (filters?: StudentFilters) => 
    api.get<PaginatedResponse<Student>>('/students', filters),

  // Get single student by ID
  getById: (id: string) => 
    api.get<{data: Student}>(`/students/${id}`),

  // Create new student
  create: (data: Omit<Student, 'id' | 'collegeName' | 'departmentName' | 'createdAt' | 'updatedAt'>) => 
    api.post<{data: Student}>('/students', data),

  // Update existing student
  update: (id: string, data: Partial<Omit<Student, 'id' | 'collegeName' | 'departmentName' | 'createdAt' | 'updatedAt'>>) => 
    api.put<{data: Student}>(`/students/${id}`, data),

  // Delete student
  delete: (id: string) => 
    api.delete<{message: string}>(`/students/${id}`),
};
