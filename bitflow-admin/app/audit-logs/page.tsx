'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { apiClient } from '@/lib/api-client'
import { useToast } from '@/components/ui/toast'
import type { ApiResponse } from '@/types'
import {
  ArrowLeft,
  Search,
  Download,
  Calendar,
  User,
  Activity,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'

interface AuditLog {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT'
  resourceType: string
  resourceId: string
  details: string
  ipAddress: string
  userAgent: string
}

export default function AuditLogsPage() {
  const toast = useToast()
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    user: '',
    action: '',
    dateRange: '7days',
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    perPage: 20,
    total: 0,
  })

  useEffect(() => {
    fetchLogs()
  }, [filters, pagination.currentPage])

  const fetchLogs = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.get<
        ApiResponse<{ logs: AuditLog[]; total: number }>
      >('/admin/audit-logs', {
        params: {
          page: pagination.currentPage,
          per_page: pagination.perPage,
          search: filters.search,
          user: filters.user,
          action: filters.action,
          date_range: filters.dateRange,
        },
      })
      setLogs(response.data.logs || [])
      setPagination((prev) => ({
        ...prev,
        total: response.data.total || 0,
        totalPages: Math.ceil((response.data.total || 0) / prev.perPage),
      }))
    } catch (error) {
      console.error('Failed to fetch audit logs:', error)
      toast.error('Failed to load audit logs')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      toast.info('Preparing export...')
      await apiClient.get('/admin/audit-logs/export', {
        params: filters,
        responseType: 'blob',
      })
      toast.success('Export completed')
    } catch (error) {
      toast.error('Export failed')
    }
  }

  const getActionBadge = (action: string) => {
    const variants: Record<string, 'success' | 'info' | 'warning' | 'danger'> = {
      CREATE: 'success',
      READ: 'info',
      UPDATE: 'warning',
      DELETE: 'danger',
      LOGIN: 'info',
      LOGOUT: 'info',
    }
    return <Badge variant={variants[action] || 'default'}>{action}</Badge>
  }

  if (isLoading && logs.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Platform Audit Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
              <p className="text-sm text-gray-500 mt-2">Loading audit logs...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Audit Logs</h1>
          <p className="text-gray-500 mt-1">
            Track all administrative actions and system events
          </p>
        </div>
        <Button onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Actions</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
              <option value="LOGIN">Login</option>
              <option value="LOGOUT">Logout</option>
            </select>

            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1day">Last 24 Hours</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>

            <Button
              variant="outline"
              onClick={() =>
                setFilters({ search: '', user: '', action: '', dateRange: '7days' })
              }
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Showing {logs.length} of {pagination.total.toLocaleString()} logs
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No audit logs found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Time</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Resource
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Details</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">IP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-sm">{log.userName}</td>
                        <td className="py-3 px-4">{getActionBadge(log.action)}</td>
                        <td className="py-3 px-4 text-sm">
                          <div>
                            <p className="font-medium">{log.resourceType}</p>
                            <p className="text-xs text-gray-500">{log.resourceId}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{log.details}</td>
                        <td className="py-3 px-4 text-sm text-gray-500">{log.ipAddress}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        currentPage: Math.max(1, prev.currentPage - 1),
                      }))
                    }
                    disabled={pagination.currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        currentPage: Math.min(prev.totalPages, prev.currentPage + 1),
                      }))
                    }
                    disabled={pagination.currentPage === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
