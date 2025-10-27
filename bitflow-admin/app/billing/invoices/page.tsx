'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { Download, ArrowLeft, Search, Filter, FileDown } from 'lucide-react';
import type { ApiResponse } from '@/types';

interface Invoice {
  id: string;
  invoiceNumber: string;
  universityId: string;
  universityName: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  dueDate: string;
  paidAt: string | null;
  createdAt: string;
  items: {
    description: string;
    amount: number;
  }[];
}

export default function InvoicesPage() {
  const router = useRouter();
  const toast = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('30');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(20);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchInvoices();
  }, [currentPage, statusFilter, dateRange, search]);

  const fetchInvoices = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: perPage.toString(),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(dateRange !== 'all' && { days: dateRange }),
        ...(search && { search }),
      });

      const response = await apiClient.get<ApiResponse<{ invoices: Invoice[]; meta: any }>>(
        `/admin/billing/invoices?${params}`
      );

      if (response.data) {
        setInvoices(response.data.invoices);
        const meta = response.data.meta;
        setTotalPages(meta.last_page || 1);
        setTotal(meta.total || 0);
      }
    } catch (err: any) {
      console.error('Failed to fetch invoices:', err);
      setError(err.message || 'Failed to load invoices');
      toast.error('Failed to load invoices');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      const response: any = await apiClient.get(`/admin/billing/invoices/${invoiceId}/download`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Invoice downloaded successfully');
    } catch (err) {
      console.error('Failed to download invoice:', err);
      toast.error('Failed to download invoice');
    }
  };

  const handleRetryPayment = async (invoiceId: string) => {
    try {
      await apiClient.post(`/admin/billing/invoices/${invoiceId}/retry`);
      toast.success('Payment retry initiated');
      fetchInvoices();
    } catch (err) {
      console.error('Failed to retry payment:', err);
      toast.error('Failed to retry payment');
    }
  };

  const handleExport = async () => {
    try {
      const response: any = await apiClient.get('/admin/billing/invoices/export', {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoices-export-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Invoices exported successfully');
    } catch (err) {
      console.error('Failed to export invoices:', err);
      toast.error('Failed to export invoices');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
      paid: 'success',
      pending: 'warning',
      failed: 'danger',
      refunded: 'info',
    };
    return <Badge variant={variants[status] || 'info'}>{status.toUpperCase()}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push('/billing')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Billing
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Invoices</h1>
            <p className="text-gray-600">Manage all platform invoices</p>
          </div>
        </div>
        <Button onClick={handleExport}>
          <FileDown className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by invoice number or university..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="all">All time</option>
          </select>
        </div>
      </Card>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {invoices.length} of {total} invoices
      </div>

      {/* Invoices Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">University</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="mt-2 text-gray-500">Loading invoices...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button onClick={fetchInvoices} variant="outline">
                      Retry
                    </Button>
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No invoices found
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {invoice.universityName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(invoice.dueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(invoice.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadInvoice(invoice.id)}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          PDF
                        </Button>
                        {invoice.status === 'failed' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRetryPayment(invoice.id)}
                          >
                            Retry
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && invoices.length > 0 && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
