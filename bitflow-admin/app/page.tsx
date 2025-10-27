'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PlatformStatsGrid } from '@/components/platform/PlatformStatsGrid'
import { UniversityActivityFeed } from '@/components/platform/UniversityActivityFeed'
import { SystemHealthPanel } from '@/components/platform/SystemHealthPanel'
import { AlertsPanel } from '@/components/platform/AlertsPanel'
import { RevenueChart } from '@/components/platform/RevenueChart'
import { Building2, School, Users, Activity, HardDrive, TrendingUp, Zap, DollarSign } from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import type { ApiResponse, University } from '@/types'

interface DashboardStats {
  totalUniversities: number
  totalColleges: number
  totalUsers: number
  apiRequests: number
  storageUsed: number
  storageTotal: number
  mrr: number
  activeSessions: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUniversities: 0,
    totalColleges: 0,
    totalUsers: 0,
    apiRequests: 0,
    storageUsed: 0,
    storageTotal: 2000,
    mrr: 0,
    activeSessions: 0,
  })
  const [systemMetrics, setSystemMetrics] = useState({
    apiLatency: 45,
    dbResponseTime: 12,
    redisHitRate: 98,
    uptime: 99.98,
  })
  const [alerts, setAlerts] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch dashboard stats
        const dashboardResponse = await apiClient.get<ApiResponse<any>>('/admin/dashboard')
        const healthResponse = await apiClient.get<ApiResponse<any>>('/admin/system/health')
        const alertsResponse = await apiClient.get<ApiResponse<any[]>>('/admin/alerts')
        const activityResponse = await apiClient.get<ApiResponse<any[]>>('/admin/activity')
        const revenueResponse = await apiClient.get<ApiResponse<any>>('/admin/revenue')

        const dashboardData = dashboardResponse.data
        const healthData = healthResponse.data
        const revenueData = revenueResponse.data
        
        setStats({
          totalUniversities: dashboardData.total_universities || 0,
          totalColleges: dashboardData.total_colleges || 0,
          totalUsers: dashboardData.total_users || 0,
          apiRequests: 0, // Real-time metric, could be from health endpoint
          storageUsed: Math.round(dashboardData.storage_used_gb || 0),
          storageTotal: Math.round(dashboardData.storage_total_gb || 2000),
          mrr: revenueData.mrr || 0,
          activeSessions: dashboardData.active_users_30d || 0,
        })

        setSystemMetrics({
          apiLatency: healthData.api_latency || 0,
          dbResponseTime: healthData.db_response_time || 0,
          redisHitRate: healthData.redis_hit_rate || 0,
          uptime: healthData.uptime || 0,
        })

        setAlerts(alertsResponse.data || [])
        setActivities(activityResponse.data || [])
        
        // Use real revenue trend data
        setRevenueData(revenueData.trend || [])
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: 'Total Universities',
      value: stats.totalUniversities,
      change: stats.totalUniversities > 0 ? 'Active' : 'Get started',
      icon: Building2,
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-50',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: stats.totalUsers > 0 ? 'Platform users' : 'No users yet',
      icon: Users,
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-50',
    },
    {
      title: 'API Requests (24h)',
      value: stats.apiRequests > 0 ? `${(stats.apiRequests / 1000).toFixed(1)}M` : '0',
      change: '🟢 System operational',
      icon: Zap,
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-50',
    },
    {
      title: 'Storage Used',
      value: `${stats.storageUsed} GB`,
      change: stats.storageTotal > 0 ? `${((stats.storageUsed / stats.storageTotal) * 100).toFixed(1)}% capacity` : '0% capacity',
      icon: HardDrive,
      iconColor: 'text-orange-600',
      iconBgColor: 'bg-orange-50',
    },
    {
      title: 'MRR',
      value: stats.mrr > 0 ? `$${(stats.mrr / 1000).toFixed(0)}K` : '$0',
      change: stats.mrr > 0 ? 'Monthly revenue' : 'No revenue yet',
      icon: DollarSign,
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-50',
    },
    {
      title: 'Total Colleges',
      value: stats.totalColleges,
      change: stats.totalColleges > 0 ? 'Institutions' : 'No colleges yet',
      icon: School,
      iconColor: 'text-indigo-600',
      iconBgColor: 'bg-indigo-50',
    },
    {
      title: 'Active Sessions',
      value: stats.activeSessions,
      change: 'Last 30 days',
      icon: Activity,
      iconColor: 'text-cyan-600',
      iconBgColor: 'bg-cyan-50',
    },
    {
      title: 'System Uptime',
      value: `${systemMetrics.uptime.toFixed(2)}%`,
      change: 'Platform stability',
      icon: TrendingUp,
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-50',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Platform Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to Bitflow Admin Portal</p>
      </div>

      {/* Stats Grid */}
      <PlatformStatsGrid stats={statCards} isLoading={isLoading} />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UniversityActivityFeed activities={activities} isLoading={isLoading} />
        <div className="space-y-6">
          <SystemHealthPanel metrics={systemMetrics} isLoading={isLoading} />
          <AlertsPanel alerts={alerts} isLoading={isLoading} />
        </div>
      </div>

      {/* Revenue Overview Chart */}
      <RevenueChart data={revenueData} isLoading={isLoading} />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/universities"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Building2 className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-semibold">Manage Universities</h3>
              <p className="text-sm text-gray-500 mt-1">
                Create and manage university institutions
              </p>
            </a>
            <a
              href="/analytics"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
              <h3 className="font-semibold">Platform Analytics</h3>
              <p className="text-sm text-gray-500 mt-1">
                View growth metrics and patterns
              </p>
            </a>
            <a
              href="/users"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="h-8 w-8 text-purple-600 mb-2" />
              <h3 className="font-semibold">Manage Users</h3>
              <p className="text-sm text-gray-500 mt-1">
                Add and manage user accounts
              </p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
