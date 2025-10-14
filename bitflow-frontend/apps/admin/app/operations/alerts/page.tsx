'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@bitflow/api-client/auth/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitflow/ui/card";
import { Badge } from "@bitflow/ui/badge";
import { Button } from "@bitflow/ui/button";
import { Loader2, AlertTriangle, AlertCircle, Info, CheckCircle, RefreshCw } from 'lucide-react';

interface Alert {
  id: number;
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info' | 'success';
  status: 'open' | 'acknowledged' | 'resolved';
  source?: string;
  university_id?: number;
  university_name?: string;
  created_at: string;
  updated_at: string;
}

interface AlertSummary {
  total: number;
  critical: number;
  warning: number;
  info: number;
  success: number;
  open: number;
  acknowledged: number;
  resolved: number;
}

const severityConfig = {
  critical: {
    icon: AlertTriangle,
    variant: 'destructive' as const,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
  },
  warning: {
    icon: AlertCircle,
    variant: 'warning' as const,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-800',
  },
  info: {
    icon: Info,
    variant: 'secondary' as const,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
  },
  success: {
    icon: CheckCircle,
    variant: 'success' as const,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-800',
  },
};

const statusMap: Record<string, "success" | "warning" | "secondary"> = {
  open: "warning",
  acknowledged: "secondary",
  resolved: "success",
};

export default function OperationsAlertsPage() {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [summary, setSummary] = useState<AlertSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Fetch alerts
  useEffect(() => {
    if (!isAuthenticated) return;
    
    fetchAlerts();
  }, [isAuthenticated, severityFilter]);

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      
      if (severityFilter !== 'all') {
        params.append('severity', severityFilter);
      }
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/operations/alerts?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch alerts');
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        setAlerts(result.data.alerts || []);
        setSummary(result.data.summary || null);
      }
    } catch (err) {
      console.error('Error fetching alerts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  if (loading && !summary) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Operations Alerts</h1>
          <p className="text-muted-foreground">
            Monitor system health and operational issues across the platform
          </p>
        </div>
        <Button onClick={fetchAlerts} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card 
            className={`cursor-pointer transition-shadow hover:shadow-md ${severityFilter === 'critical' ? 'ring-2 ring-red-500' : ''}`}
            onClick={() => setSeverityFilter(severityFilter === 'critical' ? 'all' : 'critical')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{summary.critical}</div>
              <p className="text-xs text-muted-foreground">Immediate attention required</p>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-shadow hover:shadow-md ${severityFilter === 'warning' ? 'ring-2 ring-yellow-500' : ''}`}
            onClick={() => setSeverityFilter(severityFilter === 'warning' ? 'all' : 'warning')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Warning</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{summary.warning}</div>
              <p className="text-xs text-muted-foreground">Needs investigation</p>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-shadow hover:shadow-md ${severityFilter === 'info' ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => setSeverityFilter(severityFilter === 'info' ? 'all' : 'info')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Info</CardTitle>
              <Info className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{summary.info}</div>
              <p className="text-xs text-muted-foreground">Informational alerts</p>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-shadow hover:shadow-md ${severityFilter === 'success' ? 'ring-2 ring-green-500' : ''}`}
            onClick={() => setSeverityFilter(severityFilter === 'success' ? 'all' : 'success')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{summary.success}</div>
              <p className="text-xs text-muted-foreground">Resolved successfully</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex items-center gap-2">
        <Button
          variant={severityFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSeverityFilter('all')}
        >
          All ({summary?.total || 0})
        </Button>
        <Button
          variant={severityFilter === 'critical' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSeverityFilter('critical')}
        >
          Critical
        </Button>
        <Button
          variant={severityFilter === 'warning' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSeverityFilter('warning')}
        >
          Warning
        </Button>
        <Button
          variant={severityFilter === 'info' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSeverityFilter('info')}
        >
          Info
        </Button>
        <Button
          variant={severityFilter === 'success' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSeverityFilter('success')}
        >
          Success
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-red-800">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchAlerts}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerts List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : alerts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <p className="text-lg font-medium">All clear!</p>
            <p className="text-muted-foreground">
              {severityFilter !== 'all'
                ? `No ${severityFilter} alerts at the moment`
                : 'No alerts to display. System is operating normally.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => {
            const config = severityConfig[alert.severity];
            const Icon = config.icon;
            
            return (
              <Card 
                key={alert.id} 
                className={`${config.borderColor} ${config.bgColor} border-l-4`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <Icon className={`h-5 w-5 mt-0.5 ${config.textColor}`} />
                      <div className="flex-1">
                        <CardTitle className="text-base flex items-center gap-2">
                          {alert.title}
                          <Badge variant={config.variant} className="text-xs capitalize">
                            {alert.severity}
                          </Badge>
                          <Badge variant={statusMap[alert.status]} className="text-xs capitalize">
                            {alert.status}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="mt-1.5">
                          {alert.message}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-muted-foreground">
                      {alert.university_name && (
                        <span>University: {alert.university_name}</span>
                      )}
                      {alert.source && (
                        <span>Source: {alert.source}</span>
                      )}
                      <span>{getRelativeTime(alert.created_at)}</span>
                    </div>
                    <div className="flex gap-2">
                      {alert.status === 'open' && (
                        <Button variant="outline" size="sm">
                          Acknowledge
                        </Button>
                      )}
                      {alert.status !== 'resolved' && (
                        <Button variant="outline" size="sm">
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Status Summary */}
      {!loading && alerts.length > 0 && summary && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Showing {alerts.length} of {summary.total} total alerts
              </span>
              <span className="text-muted-foreground">
                {summary.open} open • {summary.acknowledged} acknowledged • {summary.resolved} resolved
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
