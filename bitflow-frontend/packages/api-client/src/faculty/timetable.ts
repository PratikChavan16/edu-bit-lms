import { useMutation, useQuery, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import type {
  FacultyAttendanceCorrection,
  FacultyAttendanceEntry,
  FacultyScheduleBlock,
} from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

interface FacultyTimetableQueryParams {
  week_start?: string;
}

interface FacultyTimetableResponse {
  success: boolean;
  data: {
    week_start: string;
    week_end: string;
    days: Record<string, FacultyScheduleBlock[]>;
  };
}

interface FacultyTimetableBlockResponse {
  success: boolean;
  data: FacultyScheduleBlock;
}

interface FacultyAttendanceResponse {
  success: boolean;
  data: {
    date: string;
    entries: FacultyAttendanceEntry[];
  };
}

interface FacultyAttendanceMutationResponse {
  success: boolean;
  data: FacultyAttendanceEntry[];
}

interface FacultyCorrectionResponse {
  success: boolean;
  data: FacultyAttendanceCorrection;
}

export function useFacultyTimetable(
  params?: FacultyTimetableQueryParams,
  options?: UseQueryOptions<FacultyTimetableResponse>,
) {
  return useQuery({
    queryKey: ['faculty', 'timetable', params],
    queryFn: async (): Promise<FacultyTimetableResponse> => {
      const query = new URLSearchParams();
      if (params?.week_start) query.append('week_start', params.week_start);

  const queryString = query.toString();
  const response = await fetch(`${API_BASE}/faculty/timetable${queryString ? `?${queryString}` : ''}`, {
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load faculty timetable');
      }

      return response.json();
    },
    ...options,
  });
}

export function useFacultyTimetableBlock(
  blockId: string,
  options?: UseQueryOptions<FacultyTimetableBlockResponse>,
) {
  return useQuery({
    queryKey: ['faculty', 'timetable', blockId],
    queryFn: async (): Promise<FacultyTimetableBlockResponse> => {
      const response = await fetch(`${API_BASE}/faculty/timetable/${blockId}`, {
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load timetable block');
      }

      return response.json();
    },
    enabled: Boolean(blockId),
    ...options,
  });
}

export function useFacultyAttendance(
  blockId: string,
  params?: { date?: string },
  options?: UseQueryOptions<FacultyAttendanceResponse>,
) {
  return useQuery({
    queryKey: ['faculty', 'attendance', blockId, params],
    queryFn: async (): Promise<FacultyAttendanceResponse> => {
      const query = new URLSearchParams();
      if (params?.date) query.append('date', params.date);

  const queryString = query.toString();
  const response = await fetch(`${API_BASE}/faculty/timetable/${blockId}/attendance${queryString ? `?${queryString}` : ''}`, {
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load attendance');
      }

      return response.json();
    },
    enabled: Boolean(blockId),
    ...options,
  });
}

export function useRecordFacultyAttendance(
  options?: UseMutationOptions<FacultyAttendanceMutationResponse, Error, { blockId: string; date: string; entries: { student_id: string; status: 'present' | 'absent' | 'late' | 'excused'; notes?: string | null }[] }>,
) {
  return useMutation({
    mutationFn: async ({ blockId, date, entries }) => {
      const response = await fetch(`${API_BASE}/faculty/timetable/${blockId}/attendance`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ date, entries }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to record attendance');
      }

      return response.json() as Promise<FacultyAttendanceMutationResponse>;
    },
    ...options,
  });
}

export function useRequestAttendanceCorrection(
  options?: UseMutationOptions<FacultyCorrectionResponse, Error, { attendanceId: string; requested_status: 'present' | 'absent' | 'late' | 'excused'; reason?: string }>,
) {
  return useMutation({
    mutationFn: async ({ attendanceId, requested_status, reason }) => {
      const response = await fetch(`${API_BASE}/faculty/attendance/${attendanceId}/corrections`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ requested_status, reason }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to request attendance correction');
      }

      return response.json() as Promise<FacultyCorrectionResponse>;
    },
    ...options,
  });
}
