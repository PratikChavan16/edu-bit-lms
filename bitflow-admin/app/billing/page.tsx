'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api-client'
import { useToast } from '@/components/ui/toast'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { BillingData } from '@/types'
import { DollarSign, TrendingUp, AlertCircle, Download, RefreshCw } from 'lucide-react'

export default function BillingPage() {
  const toast = useToast()
  const [data, setData] = useState<BillingData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchBillingData()
  }, [])

  const fetchBillingData = async () => {
    setIsLoading(true)
    try {
      const response = await apiClient.get<BillingData>('/admin/billing')
      setData(response)
    } catch (error) {
      toast.error('Failed to load billing data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetryPayment = async (invoiceId: string) => {
    try {
      await apiClient.post(`/admin/billing/invoices/${invoiceId}/retry`)
      toast.success('Payment retry initiated')
      fetchBillingData()
    } catch (error) {
      toast.error('Failed to retry payment')
    }
  }

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      await apiClient.get(`/admin/billing/invoices/${invoiceId}/pdf`)
      toast.info('PDF generation not yet implemented')
    } catch (error) {
      toast.error('Failed to download invoice')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading billing data...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto" />
          <p className="mt-4 text-gray-600">Failed to load billing data</p>
          <Button onClick={fetchBillingData} className="mt-4">Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Billing & Subscriptions</h1>
        <p className="text-gray-500 mt-1">Manage platform revenue and subscriptions</p>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Recurring Revenue</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {formatCurrency(data.revenue.mrr)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Annual Recurring Revenue</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {formatCurrency(data.revenue.arr)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Churn Rate</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {data.revenue.churnRate}%
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Subscription Status */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Subscription Status</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{data.subscriptionStatus.active}</p>
            <p className="text-sm text-gray-600 mt-1">Active</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{data.subscriptionStatus.pastDue}</p>
            <p className="text-sm text-gray-600 mt-1">Past Due</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{data.subscriptionStatus.canceled}</p>
            <p className="text-sm text-gray-600 mt-1">Canceled</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{data.subscriptionStatus.trial}</p>
            <p className="text-sm text-gray-600 mt-1">Trial</p>
          </div>
        </div>
      </Card>

      {/* Subscriptions Table */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">All Subscriptions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  University
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MRR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Billing
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.subscriptions.map((sub) => (
                <tr key={sub.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {sub.university.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {sub.plan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        sub.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : sub.status === 'past_due'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {sub.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(sub.mrr)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(sub.nextBillingDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recent Invoices */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Invoices</h2>
        <div className="space-y-3">
          {data.recentInvoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900">{invoice.university.name}</p>
                <p className="text-sm text-gray-500">
                  {formatDate(invoice.created_at)} • {formatCurrency(invoice.amount)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    invoice.status === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : invoice.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {invoice.status}
                </span>
                {invoice.status === 'failed' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRetryPayment(invoice.id)}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Retry
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDownloadInvoice(invoice.id)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
