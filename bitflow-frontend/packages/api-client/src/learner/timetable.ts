import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { LearnerTimetable } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export function useLearnerTimetable(options?: UseQueryOptions<LearnerTimetable>) {
  return useQuery({
    queryKey: ['learner', 'timetable'],
    queryFn: async (): Promise<LearnerTimetable> => {
      const res = await fetch(`${API_BASE}/learner/profile/timetable`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch learner timetable');
      }
      
      return res.json();
    },
    ...options,
  });
}
