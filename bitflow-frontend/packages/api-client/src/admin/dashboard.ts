import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { DashboardSummary, Alert } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.bitflow.test';

/**
 * Fetch admin dashboard summary
 */
export function useAdminDashboard(options?: UseQueryOptions<DashboardSummary>) {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async (): Promise<DashboardSummary> => {
      const res = await fetch(`${API_BASE}/admin/dashboard`);
      if (!res.ok) throw new Error('Failed to fetch dashboard');
      return res.json();
    },
    ...options,
  });
}

/**
 * Fetch operations alerts
 */
export function useOperationsAlerts(severity?: string, options?: UseQueryOptions<Alert[]>) {
  return useQuery({
    queryKey: ['admin', 'operations', 'alerts', severity],
    queryFn: async (): Promise<Alert[]> => {
      const url = new URL(`${API_BASE}/admin/operations/alerts`);
      if (severity) url.searchParams.set('severity', severity);
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('Failed to fetch alerts');
      const data = await res.json();
      return data.alerts;
    },
    ...options,
  });
}
