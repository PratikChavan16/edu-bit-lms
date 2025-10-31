'use client';

import { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  HardDrive, 
  TrendingUp, 
  AlertCircle,
  Calendar,
  Globe,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ButtonLoading } from '@/components/ui/LoadingStates';
import { DashboardSkeleton } from '@/components/ui/SkeletonLayouts';
import { BarChart, PieChart, ChartCard } from '@/components/ui/Charts';
import { formatNumber, formatBytes } from '@/lib/chart-utils';

interface UniversityInfo {
  id: string;
  name: string;
  domain: string;
  status: string;
  established_year: number;
}

interface Totals {
  colleges: number;
  users: number;
  active_users_30d: number;
  active_colleges: number;
}

interface Storage {
  used_gb: number;
  quota_gb: number;
  available_gb: number;
  usage_percent: number;
  status: 'ok' | 'warning' | 'critical';
}

interface Activity {
  last_24h: {
    colleges: number;
    users: number;
  };
  last_7d: {
    colleges: number;
    users: number;
  };
}

interface TopCollege {
  id: string;
  name: string;
  users_count: number;
  status: string;
}

interface StatusDistribution {
  active: number;
  inactive: number;
  suspended: number;
}

interface DashboardStats {
  university: UniversityInfo;
  totals: Totals;
  storage: Storage;
  activity: Activity;
  top_colleges: TopCollege[];
  status_distribution: StatusDistribution;
}

export function UniversityOwnerDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const response = await fetch('/api/v1/university-owner/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard');
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        setStats(result.data);
      } else {
        throw new Error(result.message || 'Failed to load dashboard');
      }
    } catch (err) {
      console.error('Dashboard error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error || !stats) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">{error || 'No data available'}</p>
        <Button onClick={() => fetchDashboard()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  const { university, totals, storage, activity, top_colleges, status_distribution } = stats;

  // Calculate storage status color
  const getStorageColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  const getStorageProgressColor = (percent: number) => {
    if (percent > 90) return 'bg-red-500';
    if (percent > 75) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  // Prepare chart data
  const activityChartData = [
    { name: 'Colleges', value: 0, '24h': activity.last_24h.colleges, '7d': activity.last_7d.colleges },
    { name: 'Users', value: 0, '24h': activity.last_24h.users, '7d': activity.last_7d.users },
  ];

  const statusChartData = [
    { name: 'Active', value: status_distribution.active },
    { name: 'Inactive', value: status_distribution.inactive },
    { name: 'Suspended', value: status_distribution.suspended },
  ];

  const topCollegesChartData = top_colleges.slice(0, 5).map(college => ({
    name: college.name.length > 20 ? college.name.substring(0, 20) + '...' : college.name,
    value: college.users_count,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{university.name}</h1>
          <p className="text-gray-500 mt-1">University Analytics Dashboard</p>
        </div>
        <ButtonLoading 
          onClick={() => fetchDashboard(true)} 
          isLoading={isRefreshing}
          variant="secondary"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </ButtonLoading>
      </div>

      {/* University Info Card */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">University Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Globe className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Domain</p>
              <p className="font-medium">{university.domain}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Established</p>
              <p className="font-medium">{university.established_year}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                university.status === 'active' ? 'bg-green-100 text-green-800' :
                university.status === 'suspended' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {university.status}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Building2 className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">University ID</p>
              <p className="font-medium text-xs">{university.id.substring(0, 8)}...</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Colleges */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Colleges</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{formatNumber(totals.colleges)}</p>
              <p className="text-xs text-gray-500 mt-1">
                {totals.active_colleges} active
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </Card>

        {/* Total Users */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{formatNumber(totals.users)}</p>
              <p className="text-xs text-gray-500 mt-1">
                {totals.active_users_30d} active (30d)
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </Card>

        {/* Storage Usage */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Storage Usage</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {storage.used_gb} GB
              </p>
              <p className="text-xs text-gray-500 mt-1">
                of {storage.quota_gb} GB
              </p>
            </div>
            <div className={`p-3 rounded-lg ${getStorageColor(storage.status)}`}>
              <HardDrive className="w-8 h-8" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>{storage.usage_percent}% used</span>
              <span>{storage.available_gb} GB free</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${getStorageProgressColor(storage.usage_percent)}`}
                style={{ width: `${Math.min(storage.usage_percent, 100)}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Activity (24h) */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Recent Activity</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {activity.last_24h.colleges + activity.last_24h.users}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Last 24 hours
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Comparison */}
        <ChartCard title="Activity Comparison" description="New colleges and users">
          <BarChart
            data={activityChartData}
            height={250}
            dataKeys={['24h', '7d']}
            colors={['#3B82F6', '#10B981']}
            formatter={formatNumber}
          />
        </ChartCard>

        {/* College Status Distribution */}
        <ChartCard title="College Status Distribution" description="Status breakdown">
          <PieChart
            data={statusChartData}
            height={250}
            colors={['#10B981', '#6B7280', '#EF4444']}
            showLabels
          />
        </ChartCard>
      </div>

      {/* Top Colleges Chart */}
      <ChartCard title="Top Colleges by Users" description="Colleges with most users">
        <BarChart
          data={topCollegesChartData}
          height={300}
          colors={['#8B5CF6']}
          formatter={formatNumber}
        />
      </ChartCard>

      {/* Top Colleges Table */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Top Colleges</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">College Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Users</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {top_colleges.map((college, index) => (
                <tr key={college.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">#{index + 1}</span>
                      <span className="font-medium">{college.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium">{formatNumber(college.users_count)}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      college.status === 'active' ? 'bg-green-100 text-green-800' :
                      college.status === 'suspended' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {college.status}
                    </span>
                  </td>
                </tr>
              ))}
              {top_colleges.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-gray-500">
                    No colleges found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Storage Alert */}
      {storage.status !== 'ok' && (
        <Card className={`p-6 border-l-4 ${
          storage.status === 'critical' ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'
        }`}>
          <div className="flex items-start gap-3">
            <AlertCircle className={`w-6 h-6 mt-0.5 ${
              storage.status === 'critical' ? 'text-red-600' : 'text-yellow-600'
            }`} />
            <div>
              <h3 className={`font-semibold ${
                storage.status === 'critical' ? 'text-red-900' : 'text-yellow-900'
              }`}>
                {storage.status === 'critical' ? 'Critical Storage Alert' : 'Storage Warning'}
              </h3>
              <p className={`text-sm mt-1 ${
                storage.status === 'critical' ? 'text-red-700' : 'text-yellow-700'
              }`}>
                You are using {storage.usage_percent}% of your storage quota ({storage.used_gb} GB / {storage.quota_gb} GB).
                {storage.status === 'critical' 
                  ? ' Please contact support to increase your quota or free up space.'
                  : ' Consider reviewing your storage usage.'}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
