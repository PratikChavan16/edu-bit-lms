'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { ArrowLeft, Search, Filter, FileDown, AlertCircle, AlertTriangle, Info, Activity } from 'lucide-react';
import type { ApiResponse } from '@/types';

interface SystemLog {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info' | 'debug';
  source: string;
  message: string;
  details: any;
  trace: string | null;
}

export default function SystemLogsPage() {
  const router = useRouter();
  const toast = useToast();
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('24');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(50);
  const [total, setTotal] = useState(0);
  
  // Sources list
  const [sources, setSources] = useState<string[]>([]);

  useEffect(() => {
    fetchLogs();
  }, [currentPage, levelFilter, sourceFilter, timeRange, search]);

  const fetchLogs = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: perPage.toString(),
        ...(levelFilter !== 'all' && { level: levelFilter }),
        ...(sourceFilter !== 'all' && { source: sourceFilter }),
        ...(timeRange !== 'all' && { hours: timeRange }),
        ...(search && { search }),
      });

      const response = await apiClient.get<ApiResponse<{ logs: SystemLog[]; sources: string[]; meta: any }>>(
        `/admin/system-logs?${params}`
      );

      if (response.data) {
        setLogs(response.data.logs);
        if (response.data.sources) {
          setSources(response.data.sources);
        }
        const meta = response.data.meta;
        setTotalPages(meta.last_page || 1);
        setTotal(meta.total || 0);
      }
    } catch (err: any) {
      console.error('Failed to fetch system logs:', err);
      setError(err.message || 'Failed to load system logs');
      toast.error('Failed to load system logs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response: any = await apiClient.get('/admin/system-logs/export', {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `system-logs-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('System logs exported successfully');
    } catch (err) {
      console.error('Failed to export logs:', err);
      toast.error('Failed to export logs');
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getLevelBadge = (level: string) => {
    const config: Record<string, { variant: 'success' | 'warning' | 'danger' | 'info'; icon: any }> = {
      error: { variant: 'danger', icon: AlertCircle },
      warning: { variant: 'warning', icon: AlertTriangle },
      info: { variant: 'info', icon: Info },
      debug: { variant: 'info', icon: Activity },
    };
    
    const { variant, icon: Icon } = config[level] || config.info;
    
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {level.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold">System Logs & Monitoring</h1>
            <p className="text-gray-600">Monitor platform health and errors</p>
          </div>
        </div>
        <Button onClick={handleExport}>
          <FileDown className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search log messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">All Levels</option>
            <option value="error">Error</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
          </select>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg min-w-[150px]"
          >
            <option value="all">All Sources</option>
            {sources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="1">Last 1 hour</option>
            <option value="6">Last 6 hours</option>
            <option value="24">Last 24 hours</option>
            <option value="168">Last 7 days</option>
            <option value="all">All time</option>
          </select>
        </div>
      </Card>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {logs.length} of {total} log entries
      </div>

      {/* Logs Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="mt-2 text-gray-500">Loading system logs...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button onClick={fetchLogs} variant="outline">
                      Retry
                    </Button>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No logs found for selected filters</p>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(log.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getLevelBadge(log.level)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                      {log.source}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{log.message}</div>
                      {log.details && (
                        <details className="mt-1">
                          <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                            View details
                          </summary>
                          <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-x-auto">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </details>
                      )}
                      {log.trace && (
                        <details className="mt-1">
                          <summary className="text-xs text-red-500 cursor-pointer hover:text-red-700">
                            View stack trace
                          </summary>
                          <pre className="mt-2 p-2 bg-red-50 rounded text-xs overflow-x-auto text-red-900">
                            {log.trace}
                          </pre>
                        </details>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && logs.length > 0 && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
