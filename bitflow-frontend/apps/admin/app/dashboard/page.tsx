'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@bitflow/api-client/auth/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitflow/ui/card";
import { Badge } from "@bitflow/ui/badge";
import { Button } from "@bitflow/ui/button";
import { Separator } from "@bitflow/ui/separator";
import { Loader2 } from "lucide-react";

interface DashboardData {
  welcome: {
    operatorName: string;
    pendingTasks: number;
    message: string;
  };
  metrics: Array<{
    label: string;
    value: string;
    delta: string;
  }>;
  activities: Array<{
    title: string;
    description: string;
    occurredAt: string;
  }>;
  provisioningQueue: {
    slaBreached: number;
    items: Array<{
      id: string;
      name: string;
      university: string;
      requestedAt: string;
      waitingHours: number;
      slaBreached: boolean;
    }>;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    fetchDashboard();
  }, [isAuthenticated, token]);

  const fetchDashboard = async () => {
    if (!token) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/admin/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        // Handle standardized API response format: { data: {...} }
        // Fallback to direct data for backwards compatibility
        const dashboardData = result.data || result;
        setData(dashboardData);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load dashboard data</p>
        <Button onClick={fetchDashboard} className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back, {data.welcome.operatorName}</h1>
          <p className="text-muted-foreground">
            {data.welcome.message}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/universities")}>View Universities</Button>
          <Button onClick={() => router.push("/colleges")}>Manage Colleges</Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric) => (
          <Card key={metric.label} className="bg-surface">
            <CardHeader>
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle className="text-2xl">{metric.value}</CardTitle>
            </CardHeader>
            {metric.delta && (
              <CardContent>
                <p className="text-sm text-muted-foreground">{metric.delta}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent activity</CardTitle>
              <CardDescription>Real-time operational log</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.activities.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No recent activities</p>
            ) : (
              data.activities.map((activity, index) => (
                <div key={index} className="space-y-1">
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <Separator />
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Provisioning Queue</CardTitle>
            <CardDescription>{data.provisioningQueue.items.length} pending</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.provisioningQueue.items.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No pending approvals</p>
            ) : (
              data.provisioningQueue.items.map((item) => (
                <div key={item.id} className="rounded-lg border border-border bg-surface px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.university}</p>
                      <p className="text-xs text-muted-foreground mt-1">Waiting: {item.waitingHours}h</p>
                    </div>
                    {item.slaBreached && (
                      <Badge variant="destructive">SLA Breach</Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
