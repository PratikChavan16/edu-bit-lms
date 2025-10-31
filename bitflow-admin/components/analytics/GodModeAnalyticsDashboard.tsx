'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Crown, 
  Building2, 
  GraduationCap, 
  Users, 
  HardDrive, 
  AlertTriangle,
  RefreshCw,
  BarChart3,
  GitCompare,
  TrendingUp,
  Download,
  FileSpreadsheet,
  FileText,
  Printer
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';
import { DashboardSkeleton } from '@/components/ui/SkeletonLayouts';
import { ButtonLoading } from '@/components/ui/LoadingStates';
import { BarChart, PieChart, ChartCard } from '@/components/ui/Charts';
import { UniversityComparison } from '@/components/analytics/UniversityComparison';
import { formatNumber, formatBytes } from '@/lib/chart-utils';
import { exportAnalyticsAsCSV, exportAnalyticsAsExcel, downloadAsJSON, printAnalytics } from '@/lib/export-utils';

interface DashboardStats {
  overview: {
    total_universities: number;
    active_universities: number;
    total_colleges: number;
    active_colleges: number;
    total_users: number;
    active_users: number;
  };
  storage: {
    total_quota_gb: number;
    total_used_gb: number;
    usage_percent: number;
  };
  universities: {
    top_by_colleges: Array<{
      id: string;
      name: string;
      colleges_count: number;
      users_count: number;
    }>;
    top_by_users: Array<{
      id: string;
      name: string;
      users_count: number;
      colleges_count: number;
    }>;
    storage_critical: Array<{
      id: string;
      name: string;
      storage_used_gb: number;
      storage_quota_gb: number;
      usage_percent: number;
    }>;
  };
  activity: {
    last_24h: {
      universities_created: number;
      colleges_created: number;
      users_created: number;
      reports_generated: number;
    };
    last_7d: {
      universities_created: number;
      colleges_created: number;
      users_created: number;
      reports_generated: number;
    };
  };
}

export default function GodModeAnalyticsDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'charts' | 'comparison'>('overview');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const hasGodMode = user?.roles?.some((role: string) => 
    role === 'bitflow_owner' || role === 'bitflow_admin'
  );

  const fetchStats = async (clearCache = false) => {
    try {
      setRefreshing(true);

      if (clearCache) {
        const clearResponse: any = await apiClient.post('/api/v1/god-mode/cache/clear');
        if (!clearResponse.success) {
          throw new Error('Failed to clear cache');
        }
      }

      const response: any = await apiClient.get('/api/v1/god-mode/dashboard');
      if (response.success) {
        setStats(response.data as DashboardStats);
      } else {
        throw new Error(response.error?.message || 'Failed to fetch stats');
      }
    } catch (error) {
      console.error('Error fetching God Mode stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (hasGodMode) {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [hasGodMode]);

  if (!hasGodMode) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Access Restricted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              God Mode access required. Only Bitflow Owners and Admins can view this dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Data Available</CardTitle>
          </CardHeader>
          <CardContent>
            <ButtonLoading
              isLoading={refreshing}
              loadingText="Retrying..."
              onClick={() => fetchStats()}
              variant="primary"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </ButtonLoading>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crown className="w-8 h-8 text-yellow-500" />
          <div>
            <h1 className="text-3xl font-bold">God Mode Analytics</h1>
            <p className="text-muted-foreground">
              Platform-wide insights across all universities
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Export Menu */}
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowExportMenu(!showExportMenu)}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            
            {showExportMenu && stats && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-gray-200 shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      exportAnalyticsAsCSV(stats, `analytics-${new Date().toISOString().split('T')[0]}.csv`)
                      setShowExportMenu(false)
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FileText className="w-4 h-4" />
                    Export as CSV
                  </button>
                  <button
                    onClick={() => {
                      exportAnalyticsAsExcel(stats, `analytics-${new Date().toISOString().split('T')[0]}.xlsx`)
                      setShowExportMenu(false)
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    Export as Excel
                  </button>
                  <button
                    onClick={() => {
                      downloadAsJSON(stats, `analytics-${new Date().toISOString().split('T')[0]}.json`)
                      setShowExportMenu(false)
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FileText className="w-4 h-4" />
                    Export as JSON
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={() => {
                      printAnalytics(stats)
                      setShowExportMenu(false)
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Printer className="w-4 h-4" />
                    Print / PDF
                  </button>
                </div>
              </div>
            )}
          </div>

          <ButtonLoading
            onClick={() => fetchStats(true)}
            isLoading={refreshing}
            loadingText="Refreshing..."
            variant="secondary"
            size="md"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </ButtonLoading>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`
              flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <TrendingUp className="w-4 h-4" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={`
              flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${
                activeTab === 'charts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <BarChart3 className="w-4 h-4" />
            Charts & Trends
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`
              flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${
                activeTab === 'comparison'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <GitCompare className="w-4 h-4" />
            University Comparison
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">{/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Universities</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-500" />
              {stats.overview.total_universities}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {stats.overview.active_universities} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Colleges</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-purple-500" />
              {stats.overview.total_colleges}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {stats.overview.active_colleges} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Users className="w-6 h-6 text-green-500" />
              {stats.overview.total_users}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {stats.overview.active_users} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Platform Storage</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <HardDrive className="w-6 h-6 text-orange-500" />
              {stats.storage.usage_percent.toFixed(1)}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {stats.storage.total_used_gb.toFixed(1)} GB / {stats.storage.total_quota_gb} GB
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Last 24 Hours</CardTitle>
            <CardDescription>Recent platform activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Universities Created</span>
              <Badge variant="info">{stats.activity.last_24h.universities_created}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Colleges Created</span>
              <Badge variant="info">{stats.activity.last_24h.colleges_created}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Users Registered</span>
              <Badge variant="info">{stats.activity.last_24h.users_created}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Reports Generated</span>
              <Badge variant="info">{stats.activity.last_24h.reports_generated}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Last 7 Days</CardTitle>
            <CardDescription>Weekly activity summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Universities Created</span>
              <Badge variant="info">{stats.activity.last_7d.universities_created}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Colleges Created</span>
              <Badge variant="info">{stats.activity.last_7d.colleges_created}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Users Registered</span>
              <Badge variant="info">{stats.activity.last_7d.users_created}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Reports Generated</span>
              <Badge variant="info">{stats.activity.last_7d.reports_generated}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Universities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Top Universities by Colleges</CardTitle>
            <CardDescription>Universities with most colleges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.universities.top_by_colleges.map((uni, idx) => (
                <div key={uni.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">{idx + 1}</Badge>
                    <div>
                      <p className="font-medium">{uni.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {uni.users_count} users
                      </p>
                    </div>
                  </div>
                  <Badge variant="success">{uni.colleges_count} colleges</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Universities by Users</CardTitle>
            <CardDescription>Most active user bases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.universities.top_by_users.map((uni, idx) => (
                <div key={uni.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">{idx + 1}</Badge>
                    <div>
                      <p className="font-medium">{uni.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {uni.colleges_count} colleges
                      </p>
                    </div>
                  </div>
                  <Badge variant="success">{uni.users_count} users</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Storage Alerts */}
      {stats.universities.storage_critical.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Storage Alerts
            </CardTitle>
            <CardDescription>Universities approaching storage limits (≥90%)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.universities.storage_critical.map((uni) => (
                <div key={uni.id} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                  <div>
                    <p className="font-medium">{uni.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {uni.storage_used_gb.toFixed(1)} GB / {uni.storage_quota_gb} GB
                    </p>
                  </div>
                  <Badge variant="danger">{uni.usage_percent.toFixed(1)}% used</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
        </div>
      )}

      {/* Charts Tab */}
      {activeTab === 'charts' && (
        <div className="space-y-6">
          {/* Chart Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Universities by Colleges"
              description="Top 5 universities by college count"
            >
              <BarChart
                data={stats.universities.top_by_colleges.map((u) => ({
                  name: u.name.substring(0, 15) + '...',
                  value: u.colleges_count,
                }))}
                height={250}
                colors={['#3B82F6']}
                formatter={formatNumber}
              />
            </ChartCard>

            <ChartCard
              title="Universities by Users"
              description="Top 5 universities by user count"
            >
              <BarChart
                data={stats.universities.top_by_users.map((u) => ({
                  name: u.name.substring(0, 15) + '...',
                  value: u.users_count,
                }))}
                height={250}
                colors={['#10B981']}
                formatter={formatNumber}
              />
            </ChartCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Platform Status Distribution"
              description="Active vs Inactive distribution"
            >
              <PieChart
                data={[
                  { name: 'Active Universities', value: stats.overview.active_universities },
                  { name: 'Inactive Universities', value: stats.overview.total_universities - stats.overview.active_universities },
                ]}
                height={250}
                colors={['#10B981', '#6B7280']}
                formatter={formatNumber}
              />
            </ChartCard>

            <ChartCard
              title="Storage Usage Overview"
              description="Platform-wide storage utilization"
            >
              <PieChart
                data={[
                  { name: 'Used Storage', value: Math.round(stats.storage.total_used_gb) },
                  { name: 'Available Storage', value: Math.round(stats.storage.total_quota_gb - stats.storage.total_used_gb) },
                ]}
                height={250}
                colors={['#8B5CF6', '#E5E7EB']}
                formatter={(value) => formatBytes(value * 1024 * 1024 * 1024)}
              />
            </ChartCard>
          </div>

          {/* Activity Comparison */}
          <ChartCard
            title="Activity Comparison"
            description="24h vs 7 day activity metrics"
          >
            <BarChart
              data={[
                {
                  name: 'Universities',
                  value: stats.activity.last_24h.universities_created,
                  '24h': stats.activity.last_24h.universities_created,
                  '7d': stats.activity.last_7d.universities_created,
                },
                {
                  name: 'Colleges',
                  value: stats.activity.last_24h.colleges_created,
                  '24h': stats.activity.last_24h.colleges_created,
                  '7d': stats.activity.last_7d.colleges_created,
                },
                {
                  name: 'Users',
                  value: stats.activity.last_24h.users_created,
                  '24h': stats.activity.last_24h.users_created,
                  '7d': stats.activity.last_7d.users_created,
                },
                {
                  name: 'Reports',
                  value: stats.activity.last_24h.reports_generated,
                  '24h': stats.activity.last_24h.reports_generated,
                  '7d': stats.activity.last_7d.reports_generated,
                },
              ]}
              dataKeys={['24h', '7d']}
              height={300}
              colors={['#3B82F6', '#10B981']}
              formatter={formatNumber}
            />
          </ChartCard>
        </div>
      )}

      {/* Comparison Tab */}
      {activeTab === 'comparison' && (
        <div>
          <UniversityComparison />
        </div>
      )}
    </div>
  );
}

