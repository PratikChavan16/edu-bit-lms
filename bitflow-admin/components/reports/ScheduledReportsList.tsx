'use client'

import { useState, useEffect } from 'react'
import { Calendar, Mail, Play, Pause, Trash2, Edit, Clock, CheckCircle, XCircle, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { apiClient } from '@/lib/api-client'

interface ScheduledReport {
  id: string
  name: string
  description: string
  report_type: string
  cron_expression: string
  frequency_label: string
  next_run_at: string
  last_run_at: string | null
  recipients: string[]
  is_active: boolean
  run_count: number
  success_count: number
  failure_count: number
  created_at: string
  creator: {
    name: string
    email: string
  }
}

interface ScheduledReportsListProps {
  refreshTrigger: number
}

export function ScheduledReportsList({ refreshTrigger }: ScheduledReportsListProps) {
  const [schedules, setSchedules] = useState<ScheduledReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduledReport | null>(null)
  const [showExecutions, setShowExecutions] = useState(false)

  useEffect(() => {
    fetchSchedules()
  }, [refreshTrigger])

  const fetchSchedules = async () => {
    setIsLoading(true)
    try {
      const response: any = await apiClient.get('/scheduled-reports')
      setSchedules(response.data.data)
    } catch (error) {
      console.error('Failed to fetch scheduled reports:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggle = async (id: string) => {
    try {
      await apiClient.post(`/scheduled-reports/${id}/toggle`)
      fetchSchedules()
    } catch (error) {
      console.error('Failed to toggle schedule:', error)
      alert('Failed to toggle schedule')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return
    }

    try {
      await apiClient.delete(`/scheduled-reports/${id}`)
      fetchSchedules()
    } catch (error) {
      console.error('Failed to delete schedule:', error)
      alert('Failed to delete schedule')
    }
  }

  const handleRunNow = async (id: string, name: string) => {
    if (!confirm(`Run "${name}" immediately? The report will be sent to all recipients.`)) {
      return
    }

    try {
      await apiClient.post(`/scheduled-reports/${id}/run-now`)
      alert('Report generation queued. You will receive the report via email shortly.')
    } catch (error) {
      console.error('Failed to run report:', error)
      alert('Failed to run report')
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getSuccessRate = (schedule: ScheduledReport) => {
    if (schedule.run_count === 0) return 0
    return Math.round((schedule.success_count / schedule.run_count) * 100)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading scheduled reports...</div>
      </div>
    )
  }

  if (schedules.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Scheduled Reports</h3>
        <p className="text-gray-500">
          Create your first scheduled report to automate report generation and delivery.
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {schedules.map((schedule) => (
        <Card key={schedule.id} className="p-6">
          <div className="flex items-start justify-between">
            {/* Left: Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold">{schedule.name}</h3>
                {schedule.is_active ? (
                  <Badge variant="success" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Active
                  </Badge>
                ) : (
                  <Badge variant="default" className="flex items-center gap-1">
                    <Pause className="h-3 w-3" />
                    Paused
                  </Badge>
                )}
                <Badge variant="info">
                  {schedule.report_type.charAt(0).toUpperCase() + schedule.report_type.slice(1)}
                </Badge>
              </div>

              {schedule.description && (
                <p className="text-sm text-gray-600 mb-3">{schedule.description}</p>
              )}

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-500 flex items-center gap-1 mb-1">
                    <Calendar className="h-4 w-4" />
                    Schedule
                  </div>
                  <div className="font-medium">{schedule.frequency_label}</div>
                </div>

                <div>
                  <div className="text-gray-500 flex items-center gap-1 mb-1">
                    <Clock className="h-4 w-4" />
                    Next Run
                  </div>
                  <div className="font-medium">{formatDate(schedule.next_run_at)}</div>
                </div>

                <div>
                  <div className="text-gray-500 flex items-center gap-1 mb-1">
                    <History className="h-4 w-4" />
                    Last Run
                  </div>
                  <div className="font-medium">{formatDate(schedule.last_run_at)}</div>
                </div>

                <div>
                  <div className="text-gray-500 flex items-center gap-1 mb-1">
                    <Mail className="h-4 w-4" />
                    Recipients
                  </div>
                  <div className="font-medium">{schedule.recipients.length} email(s)</div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                <div className="text-sm">
                  <span className="text-gray-500">Total Runs:</span>{' '}
                  <span className="font-semibold">{schedule.run_count}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Success:</span>{' '}
                  <span className="font-semibold text-green-600">{schedule.success_count}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Failed:</span>{' '}
                  <span className="font-semibold text-red-600">{schedule.failure_count}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Success Rate:</span>{' '}
                  <span className="font-semibold">{getSuccessRate(schedule)}%</span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-col gap-2 ml-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRunNow(schedule.id, schedule.name)}
                className="flex items-center gap-1"
              >
                <Play className="h-4 w-4" />
                Run Now
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleToggle(schedule.id)}
                className="flex items-center gap-1"
              >
                {schedule.is_active ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Resume
                  </>
                )}
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(schedule.id, schedule.name)}
                className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:border-red-600"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>

          {/* Recipients */}
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm text-gray-500 mb-2">Email Recipients:</div>
            <div className="flex flex-wrap gap-2">
              {schedule.recipients.map((email) => (
                <Badge key={email} variant="default" className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {email}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
