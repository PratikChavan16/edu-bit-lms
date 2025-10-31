'use client'

import { useState, useEffect } from 'react'
import { Download, Trash2, Calendar, FileText, HardDrive, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { apiClient } from '@/lib/api-client'

interface ReportHistoryItem {
  id: string
  name: string
  report_type: string
  file_name: string
  file_size_kb: number
  paper_size: string
  orientation: string
  records_count: number | null
  generated_at: string
  download_count: number
  last_downloaded_at: string | null
  generator: {
    name: string
    email: string
  }
  template: {
    name: string
  } | null
}

interface ReportHistoryProps {
  refreshTrigger?: number
}

export function ReportHistory({ refreshTrigger }: ReportHistoryProps) {
  const [reports, setReports] = useState<ReportHistoryItem[]>([])
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchHistory()
    fetchStats()
  }, [refreshTrigger])

  const fetchHistory = async () => {
    setIsLoading(true)
    try {
      const response: any = await apiClient.get('/report-history')
      setReports(response.data.data)
    } catch (error) {
      console.error('Failed to fetch report history:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response: any = await apiClient.get('/report-history/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const handleDownload = async (report: ReportHistoryItem) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/report-history/${report.id}/download`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (!response.ok) throw new Error('Download failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = report.file_name
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      fetchHistory() // Refresh to update download count
    } catch (error) {
      console.error('Failed to download report:', error)
      alert('Failed to download report')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return
    }

    try {
      await apiClient.delete(`/report-history/${id}`)
      alert('Report deleted successfully!')
      fetchHistory()
      fetchStats()
    } catch (error) {
      console.error('Failed to delete report:', error)
      alert('Failed to delete report')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) {
      alert('Please select reports to delete')
      return
    }

    if (!confirm(`Are you sure you want to delete ${selectedIds.size} report(s)?`)) {
      return
    }

    try {
      await apiClient.post('/report-history/bulk-delete', {
        ids: Array.from(selectedIds),
      })
      alert(`${selectedIds.size} report(s) deleted successfully!`)
      setSelectedIds(new Set())
      fetchHistory()
      fetchStats()
    } catch (error) {
      console.error('Failed to delete reports:', error)
      alert('Failed to delete reports')
    }
  }

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    setSelectedIds(newSelection)
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === reports.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(reports.map((r) => r.id)))
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatFileSize = (sizeKb: number) => {
    if (sizeKb < 1024) return `${sizeKb} KB`
    return `${(sizeKb / 1024).toFixed(2)} MB`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading report history...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Total Reports</div>
                <div className="text-2xl font-bold">{stats.total_reports}</div>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Storage Used</div>
                <div className="text-2xl font-bold">{stats.total_size_mb} MB</div>
              </div>
              <HardDrive className="h-8 w-8 text-purple-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Total Downloads</div>
                <div className="text-2xl font-bold">{stats.total_downloads}</div>
              </div>
              <Download className="h-8 w-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">This Month</div>
                <div className="text-2xl font-bold">{stats.reports_this_month}</div>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </Card>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 flex items-center justify-between">
          <span className="text-sm font-medium text-blue-900">
            {selectedIds.size} report(s) selected
          </span>
          <Button size="sm" variant="outline" onClick={handleBulkDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected
          </Button>
        </div>
      )}

      {/* Reports List */}
      {reports.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Reports Yet</h3>
          <p className="text-gray-500">
            Reports you generate will appear here for easy access and download.
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === reports.length}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Report
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Generated
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Size
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Downloads
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(report.id)}
                      onChange={() => toggleSelection(report.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-sm">{report.name}</div>
                    {report.template && (
                      <div className="text-xs text-gray-500">From: {report.template.name}</div>
                    )}
                    <div className="text-xs text-gray-400">
                      {report.paper_size.toUpperCase()} • {report.orientation}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="info" className="text-xs">
                      {report.report_type.charAt(0).toUpperCase() + report.report_type.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatDate(report.generated_at)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatFileSize(report.file_size_kb)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {report.download_count}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(report)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(report.id, report.name)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}
