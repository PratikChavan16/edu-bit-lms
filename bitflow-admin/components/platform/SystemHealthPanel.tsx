'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SystemMetrics {
  apiLatency: number
  dbResponseTime: number
  redisHitRate: number
  uptime: number
}

interface SystemHealthPanelProps {
  metrics: SystemMetrics
  isLoading?: boolean
}

export function SystemHealthPanel({ metrics, isLoading }: SystemHealthPanelProps) {
  const getHealthStatus = () => {
    if (metrics.apiLatency > 500 || metrics.dbResponseTime > 100) {
      return { color: 'text-red-600', bg: 'bg-red-100', label: 'Critical' }
    }
    if (metrics.apiLatency > 200 || metrics.dbResponseTime > 50) {
      return { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Warning' }
    }
    return { color: 'text-green-600', bg: 'bg-green-100', label: 'Healthy' }
  }

  const health = getHealthStatus()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>System Performance</CardTitle>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${health.bg} ${health.color}`}>
          {health.label}
        </span>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">API Latency</span>
            <span className="text-sm font-medium">{metrics.apiLatency}ms</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">DB Response Time</span>
            <span className="text-sm font-medium">{metrics.dbResponseTime}ms</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Redis Hit Rate</span>
            <span className="text-sm font-medium">{metrics.redisHitRate}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Uptime</span>
            <span className="text-sm font-medium">{metrics.uptime}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
