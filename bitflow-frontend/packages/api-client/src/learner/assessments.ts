import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { Assessment, AssessmentDetail, AssessmentSubmission } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

interface AssessmentsResponse {
  success: boolean;
  data: Assessment[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
  };
}

interface AssessmentResponse {
  success: boolean;
  data: AssessmentDetail;
}

interface SubmissionResponse {
  success: boolean;
  data: AssessmentSubmission;
}

export function useLearnerAssessments(
  filters?: { status?: string },
  options?: UseQueryOptions<AssessmentsResponse>
) {
  const queryParams = new URLSearchParams();
  if (filters?.status) queryParams.append('status', filters.status);

  return useQuery({
    queryKey: ['learner', 'assessments', filters],
    queryFn: async (): Promise<AssessmentsResponse> => {
      const res = await fetch(`${API_BASE}/learner/assessments?${queryParams}`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch assessments');
      }
      
      return res.json();
    },
    ...options,
  });
}

export function useLearnerAssessment(
  assessmentId: string,
  options?: UseQueryOptions<AssessmentResponse>
) {
  return useQuery({
    queryKey: ['learner', 'assessment', assessmentId],
    queryFn: async (): Promise<AssessmentResponse> => {
      const res = await fetch(`${API_BASE}/learner/assessments/${assessmentId}`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch assessment details');
      }
      
      return res.json();
    },
    enabled: !!assessmentId,
    ...options,
  });
}

export function useSubmitAssessment(
  options?: UseMutationOptions<SubmissionResponse, Error, { assessmentId: string; answers: Record<string, string>; uploaded_files?: string[] }>
) {
  return useMutation({
    mutationFn: async ({ assessmentId, answers, uploaded_files }) => {
      const res = await fetch(`${API_BASE}/learner/assessments/${assessmentId}/submit`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ answers, uploaded_files }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to submit assessment');
      }
      
      return res.json();
    },
    ...options,
  });
}
