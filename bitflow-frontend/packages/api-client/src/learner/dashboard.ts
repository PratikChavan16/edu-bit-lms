import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { LearnerDashboard } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.bitflow.test';

/**
 * Fetch learner dashboard data
 */
export function useLearnerDashboard(options?: UseQueryOptions<LearnerDashboard>) {
  return useQuery({
    queryKey: ['learner', 'dashboard'],
    queryFn: async (): Promise<LearnerDashboard> => {
      const res = await fetch(`${API_BASE}/learner/dashboard`);
      if (!res.ok) throw new Error('Failed to fetch learner dashboard');
      return res.json();
    },
    ...options,
  });
}
