import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { FeeInvoice, FeeSummary } from '../types';

// Hook: Get Fee Summary
export function useLearnerFeesSummary(
  options?: UseQueryOptions<FeeSummary>
) {
  return useQuery<FeeSummary>({
    queryKey: ['learner', 'fees', 'summary'],
    queryFn: async () => {
      const response = await fetch('/api/learner/fees/summary');
      if (!response.ok) throw new Error('Failed to fetch fees summary');
      return response.json();
    },
    ...options,
  });
}

// Hook: Get Invoices
export function useLearnerInvoices(
  filters?: {
    status?: string;
    year?: string;
  },
  options?: UseQueryOptions<{ data: FeeInvoice[] }>
) {
  return useQuery<{ data: FeeInvoice[] }>({
    queryKey: ['learner', 'fees', 'invoices', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.year) params.append('year', filters.year);

      const response = await fetch(`/api/learner/fees/invoices?${params}`);
      if (!response.ok) throw new Error('Failed to fetch invoices');
      return response.json();
    },
    ...options,
  });
}

// Hook: Get Single Invoice
export function useLearnerInvoice(
  invoiceId: string,
  options?: UseQueryOptions<FeeInvoice>
) {
  return useQuery<FeeInvoice>({
    queryKey: ['learner', 'fees', 'invoice', invoiceId],
    queryFn: async () => {
      const response = await fetch(`/api/learner/fees/invoices/${invoiceId}`);
      if (!response.ok) throw new Error('Failed to fetch invoice');
      return response.json();
    },
    enabled: !!invoiceId,
    ...options,
  });
}

// Hook: Initiate Payment
export function useInitiatePayment(
  options?: UseMutationOptions<{ payment_url: string }, Error, { invoiceId: string; amount: number }>
) {
  return useMutation<{ payment_url: string }, Error, { invoiceId: string; amount: number }>({
    mutationFn: async ({ invoiceId, amount }) => {
      const response = await fetch(`/api/learner/fees/invoices/${invoiceId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      if (!response.ok) throw new Error('Failed to initiate payment');
      return response.json();
    },
    ...options,
  });
}
