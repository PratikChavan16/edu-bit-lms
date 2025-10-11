import { useMutation, useQuery, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import type {
  FacultyAssessmentDetail,
  FacultyAssessmentSummary,
  FacultySubmissionSummary,
} from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

interface FacultyAssessmentsFilters {
  college_id?: string;
  status?: string;
  subject?: string;
  course?: string;
  year?: number;
  page?: number;
  per_page?: number;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T;
  meta: {
    current_page: number;
    per_page: number;
    total: number;
  };
}

interface AssessmentResponse {
  success: boolean;
  data: FacultyAssessmentDetail;
}

interface SubmissionsResponse {
  success: boolean;
  data: FacultySubmissionSummary[];
}

interface SubmissionResponseSingle {
  success: boolean;
  data: FacultySubmissionSummary;
}

export function useFacultyAssessments(
  filters?: FacultyAssessmentsFilters,
  options?: UseQueryOptions<PaginatedResponse<FacultyAssessmentSummary[]>>,
) {
  return useQuery({
    queryKey: ['faculty', 'assessments', filters],
    queryFn: async (): Promise<PaginatedResponse<FacultyAssessmentSummary[]>> => {
      const query = new URLSearchParams();
      if (filters?.college_id) query.append('college_id', filters.college_id);
      if (filters?.status) query.append('status', filters.status);
      if (filters?.subject) query.append('subject', filters.subject);
      if (filters?.course) query.append('course', filters.course);
      if (filters?.year) query.append('year', String(filters.year));
      if (filters?.page) query.append('page', String(filters.page));
      if (filters?.per_page) query.append('per_page', String(filters.per_page));

      const queryString = query.toString();
      const response = await fetch(`${API_BASE}/faculty/assessments${queryString ? `?${queryString}` : ''}`, {
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load faculty assessments');
      }

      return response.json();
    },
    ...options,
  });
}

export function useFacultyAssessment(
  assessmentId: string,
  options?: UseQueryOptions<AssessmentResponse>,
) {
  return useQuery({
    queryKey: ['faculty', 'assessments', assessmentId],
    queryFn: async (): Promise<AssessmentResponse> => {
      const response = await fetch(`${API_BASE}/faculty/assessments/${assessmentId}`, {
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load faculty assessment');
      }

      return response.json();
    },
    enabled: Boolean(assessmentId),
    ...options,
  });
}

export function useCreateFacultyAssessment(
  options?: UseMutationOptions<AssessmentResponse, Error, Record<string, unknown>>,
) {
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const response = await fetch(`${API_BASE}/faculty/assessments`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to create assessment');
      }

      return response.json() as Promise<AssessmentResponse>;
    },
    ...options,
  });
}

export function useUpdateFacultyAssessment(
  options?: UseMutationOptions<AssessmentResponse, Error, { assessmentId: string; data: Record<string, unknown> }>,
) {
  return useMutation({
    mutationFn: async ({ assessmentId, data }) => {
      const response = await fetch(`${API_BASE}/faculty/assessments/${assessmentId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to update assessment');
      }

      return response.json() as Promise<AssessmentResponse>;
    },
    ...options,
  });
}

export function useDeleteFacultyAssessment(
  options?: UseMutationOptions<{ success: boolean; message?: string }, Error, { assessmentId: string }>,
) {
  return useMutation({
    mutationFn: async ({ assessmentId }) => {
      const response = await fetch(`${API_BASE}/faculty/assessments/${assessmentId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to delete assessment');
      }

      return response.json() as Promise<{ success: boolean; message?: string }>;
    },
    ...options,
  });
}

export function useFacultyAssessmentSubmissions(
  assessmentId: string,
  options?: UseQueryOptions<SubmissionsResponse>,
) {
  return useQuery({
    queryKey: ['faculty', 'assessments', assessmentId, 'submissions'],
    queryFn: async (): Promise<SubmissionsResponse> => {
      const response = await fetch(`${API_BASE}/faculty/assessments/${assessmentId}/submissions`, {
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load assessment submissions');
      }

      return response.json();
    },
    enabled: Boolean(assessmentId),
    ...options,
  });
}

export function useGradeFacultySubmission(
  options?: UseMutationOptions<SubmissionResponseSingle, Error, { assessmentId: string; submissionId: string; marks: number; feedback?: string }>,
) {
  return useMutation({
    mutationFn: async ({ assessmentId, submissionId, marks, feedback }) => {
      const response = await fetch(`${API_BASE}/faculty/assessments/${assessmentId}/submissions/${submissionId}/grade`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ marks, feedback }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to grade submission');
      }

      return response.json() as Promise<SubmissionResponseSingle>;
    },
    ...options,
  });
}
