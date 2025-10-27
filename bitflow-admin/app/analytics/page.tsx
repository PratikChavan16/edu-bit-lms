'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Users, Building2, DollarSign, Activity } from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import type { ApiResponse, University } from '@/types'

export default function AnalyticsPage() {
  const [universities, setUniversities] = useState<University[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await apiClient.get<ApiResponse<University[]>>('/universities?per_page=100')
        setUniversities(response.data)
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  // Calculate growth metrics
  const thisMonthUniversities = universities.filter(
    (u) => new Date(u.created_at) >= new Date(new Date().setDate(1))
  ).length

  const activeUniversities = universities.filter((u) => u.status === 'active').length
  const suspendedUniversities = universities.filter((u) => u.status === 'suspended').length

  // Calculate total storage usage
  const totalStorageUsed = universities.reduce((sum, u) => sum + (u.storage_used_mb / 1024), 0)
  const totalStorageQuota = universities.reduce((sum, u) => sum + u.storage_quota_gb, 0)
  const storageUtilization = totalStorageQuota > 0 ? (totalStorageUsed / totalStorageQuota) * 100 : 0

  // Top universities by storage usage
  const topByStorage = [...universities]
    .sort((a, b) => b.storage_used_mb - a.storage_used_mb)
    .slice(0, 5)

  const growthMetrics = [
    {
      title: 'New Universities',
      value: thisMonthUniversities,
      change: '+25%',
      trend: 'up' as const,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Rate',
      value: `${totalStorageQuota > 0 ? ((activeUniversities / universities.length) * 100).toFixed(1) : 0}%`,
      change: '+5% from last month',
      trend: 'up' as const,
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Storage Utilization',
      value: `${storageUtilization.toFixed(1)}%`,
      change: storageUtilization > 80 ? 'Nearing capacity' : 'Healthy',
      trend: storageUtilization > 80 ? 'down' : 'up' as const,
      icon: TrendingUp,
      color: storageUtilization > 80 ? 'text-orange-600' : 'text-green-600',
      bgColor: storageUtilization > 80 ? 'bg-orange-50' : 'bg-green-50',
    },
    {
      title: 'Avg Users per University',
      value: '8,520',
      change: '+12% growth',
      trend: 'up' as const,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
        <p className="text-gray-500 mt-1">Growth metrics and usage patterns</p>
      </div>

      {/* Growth Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {growthMetrics.map((metric) => {
          const Icon = metric.icon
          const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {metric.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`h-5 w-5 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{metric.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendIcon className={`h-4 w-4 ${metric.color}`} />
                  <p className="text-xs text-gray-500">{metric.change}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Universities by Storage */}
        <Card>
          <CardHeader>
            <CardTitle>Top Universities by Storage Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topByStorage.map((uni, index) => {
                const usagePercent = (uni.storage_used_mb / 1024 / uni.storage_quota_gb) * 100
                return (
                  <div key={uni.id} className="flex items-center gap-4">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {uni.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              usagePercent > 90
                                ? 'bg-red-600'
                                : usagePercent > 70
                                ? 'bg-yellow-600'
                                : 'bg-green-600'
                            }`}
                            style={{ width: `${Math.min(usagePercent, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {(uni.storage_used_mb / 1024).toFixed(1)} GB
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* University Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>University Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-gray-900">{activeUniversities}</p>
                  </div>
                </div>
                <Badge variant="success">
                  {((activeUniversities / universities.length) * 100).toFixed(0)}%
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Inactive</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {universities.filter((u) => u.status === 'inactive').length}
                    </p>
                  </div>
                </div>
                <Badge variant="warning">
                  {((universities.filter((u) => u.status === 'inactive').length / universities.length) * 100).toFixed(0)}%
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Suspended</p>
                    <p className="text-2xl font-bold text-gray-900">{suspendedUniversities}</p>
                  </div>
                </div>
                <Badge variant="danger">
                  {((suspendedUniversities / universities.length) * 100).toFixed(0)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Health */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Health Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Total Storage Allocated</p>
              <p className="text-3xl font-bold text-gray-900">{totalStorageQuota.toFixed(0)} GB</p>
              <p className="text-xs text-gray-500 mt-1">Across all universities</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Total Storage Used</p>
              <p className="text-3xl font-bold text-gray-900">{totalStorageUsed.toFixed(0)} GB</p>
              <p className="text-xs text-gray-500 mt-1">{storageUtilization.toFixed(1)}% utilized</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Total Universities</p>
              <p className="text-3xl font-bold text-gray-900">{universities.length}</p>
              <p className="text-xs text-gray-500 mt-1">+{thisMonthUniversities} this month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
