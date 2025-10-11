import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import type { AttendanceRecord, AttendanceSummary } from '../types';

// API Response Types
interface AttendanceResponse {
  summary: AttendanceSummary;
  records: AttendanceRecord[];
  calendar: {
    [date: string]: 'present' | 'absent' | 'late' | 'excused' | 'holiday';
  };
}

// Hook: Get Attendance Data
export function useLearnerAttendance(
  filters?: {
    month?: string;
    year?: string;
    subject?: string;
  },
  options?: UseQueryOptions<AttendanceResponse>
) {
  return useQuery<AttendanceResponse>({
    queryKey: ['learner', 'attendance', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.month) params.append('month', filters.month);
      if (filters?.year) params.append('year', filters.year);
      if (filters?.subject) params.append('subject', filters.subject);

      const response = await fetch(`/api/learner/profile/attendance?${params}`);
      if (!response.ok) throw new Error('Failed to fetch attendance');
      return response.json();
    },
    ...options,
  });
}
