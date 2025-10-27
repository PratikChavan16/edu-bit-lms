'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { ArrowLeft, Search, X, TrendingUp } from 'lucide-react';
import type { ApiResponse } from '@/types';

interface Subscription {
  id: string;
  universityId: string;
  universityName: string;
  plan: 'trial' | 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  mrr: number;
  nextBillingDate: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  canceledAt: string | null;
  createdAt: string;
}

export default function SubscriptionsPage() {
  const router = useRouter();
  const toast = useToast();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(20);
  const [total, setTotal] = useState(0);
  
  // Stats
  const [stats, setStats] = useState({
    active: 0,
    pastDue: 0,
    canceled: 0,
    trialing: 0,
  });

  useEffect(() => {
    fetchSubscriptions();
  }, [currentPage, statusFilter, planFilter, search]);

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: perPage.toString(),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(planFilter !== 'all' && { plan: planFilter }),
        ...(search && { search }),
      });

      const response = await apiClient.get<ApiResponse<{ subscriptions: Subscription[]; stats: any; meta: any }>>(
        `/admin/billing/subscriptions?${params}`
      );

      if (response.data) {
        setSubscriptions(response.data.subscriptions);
        if (response.data.stats) {
          setStats(response.data.stats);
        }
        const meta = response.data.meta;
        setTotalPages(meta.last_page || 1);
        setTotal(meta.total || 0);
      }
    } catch (err: any) {
      console.error('Failed to fetch subscriptions:', err);
      setError(err.message || 'Failed to load subscriptions');
      toast.error('Failed to load subscriptions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) {
      return;
    }

    try {
      await apiClient.patch(`/admin/billing/subscriptions/${subscriptionId}`, {
        action: 'cancel',
      });
      toast.success('Subscription canceled successfully');
      fetchSubscriptions();
    } catch (err) {
      console.error('Failed to cancel subscription:', err);
      toast.error('Failed to cancel subscription');
    }
  };

  const handleUpgradeSubscription = async (subscriptionId: string, newPlan: string) => {
    try {
      await apiClient.patch(`/admin/billing/subscriptions/${subscriptionId}`, {
        action: 'upgrade',
        plan: newPlan,
      });
      toast.success('Subscription upgraded successfully');
      fetchSubscriptions();
    } catch (err) {
      console.error('Failed to upgrade subscription:', err);
      toast.error('Failed to upgrade subscription');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
      active: 'success',
      past_due: 'warning',
      canceled: 'danger',
      trialing: 'info',
    };
    return <Badge variant={variants[status] || 'info'}>{status.replace('_', ' ').toUpperCase()}</Badge>;
  };

  const getPlanBadge = (plan: string) => {
    const colors: Record<string, string> = {
      trial: 'bg-gray-100 text-gray-800',
      basic: 'bg-blue-100 text-blue-800',
      pro: 'bg-purple-100 text-purple-800',
      enterprise: 'bg-green-100 text-green-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${colors[plan] || colors.basic}`}>
        {plan.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.push('/billing')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Billing
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Subscriptions</h1>
          <p className="text-gray-600">Manage all university subscriptions</p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-600">Active</div>
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Past Due</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.pastDue}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Canceled</div>
          <div className="text-2xl font-bold text-red-600">{stats.canceled}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Trial</div>
          <div className="text-2xl font-bold text-blue-600">{stats.trialing}</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by university..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="past_due">Past Due</option>
            <option value="canceled">Canceled</option>
            <option value="trialing">Trialing</option>
          </select>
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">All Plans</option>
            <option value="trial">Trial</option>
            <option value="basic">Basic</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
      </Card>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {subscriptions.length} of {total} subscriptions
      </div>

      {/* Subscriptions Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">University</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">MRR</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next Billing</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Started</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="mt-2 text-gray-500">Loading subscriptions...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button onClick={fetchSubscriptions} variant="outline">
                      Retry
                    </Button>
                  </td>
                </tr>
              ) : subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No subscriptions found
                  </td>
                </tr>
              ) : (
                subscriptions.map((subscription) => (
                  <tr key={subscription.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {subscription.universityName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPlanBadge(subscription.plan)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(subscription.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold">
                      {formatCurrency(subscription.mrr)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(subscription.nextBillingDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(subscription.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        {subscription.status === 'active' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpgradeSubscription(subscription.id, 'enterprise')}
                            >
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Upgrade
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleCancelSubscription(subscription.id)}
                            >
                              <X className="w-3 h-3 mr-1" />
                              Cancel
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && subscriptions.length > 0 && (
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
