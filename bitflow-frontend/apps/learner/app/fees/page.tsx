'use client';

import { useState } from 'react';
import { useLearnerFeesSummary, useLearnerInvoices } from '@bitflow/api-client/learner';
import { Card, DataTable, Select, Badge, Button } from '@bitflow/ui';
import { DollarSign, Download, CreditCard, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function FeesPage() {
  const [filters, setFilters] = useState<{
    status?: string;
    year?: string;
  }>({});

  const { data: summary, isLoading: summaryLoading } = useLearnerFeesSummary();
  const { data: invoices, isLoading: invoicesLoading } = useLearnerInvoices(filters);

  const columns = [
    {
      header: 'Invoice Number',
      accessorKey: 'invoice_number',
      cell: ({ row }: any) => (
        <div>
          <div className="font-medium">{row.original.invoice_number}</div>
          <div className="text-sm text-gray-500">
            {row.original.academic_year} - {row.original.semester}
          </div>
        </div>
      ),
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      cell: ({ row }: any) => (
        <div className="font-medium">₹{row.original.amount.toLocaleString()}</div>
      ),
    },
    {
      header: 'Paid',
      accessorKey: 'paid_amount',
      cell: ({ row }: any) => (
        <div className="text-green-600">₹{row.original.paid_amount.toLocaleString()}</div>
      ),
    },
    {
      header: 'Balance',
      accessorKey: 'balance',
      cell: ({ row }: any) => (
        <div className="font-medium text-red-600">₹{row.original.balance.toLocaleString()}</div>
      ),
    },
    {
      header: 'Due Date',
      accessorKey: 'due_date',
      cell: ({ row }: any) => {
        const dueDate = new Date(row.original.due_date);
        const isOverdue = dueDate < new Date() && row.original.status !== 'paid';
        return (
          <div className={isOverdue ? 'text-red-600' : ''}>
            {dueDate.toLocaleDateString()}
            {isOverdue && <div className="text-xs">Overdue</div>}
          </div>
        );
      },
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }: any) => {
        const statusColors: Record<string, string> = {
          paid: 'bg-green-100 text-green-700',
          partially_paid: 'bg-yellow-100 text-yellow-700',
          pending: 'bg-blue-100 text-blue-700',
          overdue: 'bg-red-100 text-red-700',
        };
        return (
          <Badge className={statusColors[row.original.status]}>
            {row.original.status.replace('_', ' ').toUpperCase()}
          </Badge>
        );
      },
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          {row.original.status !== 'paid' && (
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <CreditCard className="h-4 w-4 mr-1" />
              Pay
            </Button>
          )}
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const statuses = ['pending', 'partially_paid', 'paid', 'overdue'];
  const years = ['2024-25', '2023-24', '2022-23'];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Fee Management</h1>
        <p className="text-gray-600 mt-1">View and manage your fee payments</p>
      </div>

      {/* Summary Cards */}
      {summaryLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-20 bg-gray-200 rounded"></div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Fees</p>
                <p className="text-2xl font-bold">₹{summary?.total_fees.toLocaleString() || 0}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Paid</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{summary?.paid_fees.toLocaleString() || 0}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  ₹{summary?.pending_fees.toLocaleString() || 0}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">
                  ₹{summary?.overdue_fees.toLocaleString() || 0}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Select
            value={filters.status || 'all'}
            onValueChange={(value) =>
              setFilters({ ...filters, status: value === 'all' ? undefined : value })
            }
          >
            <option value="all">All Status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </Select>
          <Select
            value={filters.year || 'all'}
            onValueChange={(value) =>
              setFilters({ ...filters, year: value === 'all' ? undefined : value })
            }
          >
            <option value="all">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {/* Invoices Table */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Fee Invoices</h2>
        {invoicesLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <DataTable columns={columns} data={invoices?.data || []} />
        )}
      </Card>

      {/* Payment History */}
      {summary?.invoices && summary.invoices.some((inv) => inv.payments && inv.payments.length > 0) && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Payments</h2>
          <div className="space-y-3">
            {summary.invoices
              .flatMap((inv) => inv.payments?.map((payment) => ({ ...payment, invoice: inv })) || [])
              .slice(0, 5)
              .map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">₹{payment.amount.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">
                        Invoice: {payment.invoice.invoice_number}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-gray-100 text-gray-700">
                      {payment.payment_method.toUpperCase()}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(payment.payment_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      )}
    </div>
  );
}
