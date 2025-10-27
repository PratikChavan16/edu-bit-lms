'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDateTime } from '@/lib/utils'

interface Activity {
  id: string
  type: 'university_created' | 'subscription_renewed' | 'payment_failed' | 'storage_alert'
  message: string
  timestamp: string
  severity?: 'info' | 'success' | 'warning' | 'danger'
}

interface UniversityActivityFeedProps {
  activities: Activity[]
  isLoading?: boolean
}

export function UniversityActivityFeed({ activities, isLoading }: UniversityActivityFeedProps) {
  const getSeverityBadge = (severity?: string) => {
    switch (severity) {
      case 'success':
        return <Badge variant="success">Success</Badge>
      case 'warning':
        return <Badge variant="warning">Warning</Badge>
      case 'danger':
        return <Badge variant="danger">Alert</Badge>
      default:
        return <Badge variant="info">Info</Badge>
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-12 w-12 bg-gray-200 rounded animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent University Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No recent activity</p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 pb-4 border-b last:border-0"
              >
                <div className="flex-shrink-0 mt-1">
                  {getSeverityBadge(activity.severity)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDateTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
