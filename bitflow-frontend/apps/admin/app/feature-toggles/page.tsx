'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@bitflow/api-client/auth/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitflow/ui/card";
import { Badge } from "@bitflow/ui/badge";
import { Button } from "@bitflow/ui/button";
import { Switch } from "@bitflow/ui/switch";
import { Input } from "@bitflow/ui/input";
import { Loader2, Search, Plus, Filter } from 'lucide-react';

interface FeatureToggle {
  id: number;
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  scope: string;
  category?: string;
  created_at: string;
  updated_at: string;
}

export default function FeatureTogglesPage() {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [features, setFeatures] = useState<FeatureToggle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Fetch feature toggles
  useEffect(() => {
    if (!isAuthenticated) return;
    
    fetchFeatureToggles();
  }, [isAuthenticated, search, categoryFilter]);

  const fetchFeatureToggles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      
      if (search) {
        params.append('search', search);
      }
      
      if (categoryFilter !== 'all') {
        params.append('category', categoryFilter);
      }
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/feature-toggles?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch feature toggles');
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        setFeatures(Array.isArray(result.data) ? result.data : result.data.data);
      }
    } catch (err) {
      console.error('Error fetching feature toggles:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch feature toggles');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: number, currentState: boolean) => {
    setUpdatingId(id);
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/feature-toggles/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ enabled: !currentState }),
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to update feature toggle');
      }
      
      // Update local state
      setFeatures(prevFeatures =>
        prevFeatures.map(f =>
          f.id === id ? { ...f, enabled: !currentState } : f
        )
      );
    } catch (err) {
      console.error('Error updating feature toggle:', err);
      alert('Failed to update feature toggle. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(features.map(f => f.category || 'uncategorized')))];

  // Filter features
  const filteredFeatures = features.filter(feature => {
    if (search && !feature.name.toLowerCase().includes(search.toLowerCase()) &&
        !feature.key.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (loading && features.length === 0) {
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
          <h1 className="text-2xl font-semibold">Feature Toggles</h1>
          <p className="text-muted-foreground">
            Control module exposure and preview features across the platform
          </p>
        </div>
        <Button onClick={() => router.push('/feature-toggles/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Feature
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search features by name or key..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category}
              variant={categoryFilter === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategoryFilter(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-red-800">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchFeatureToggles}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feature Toggles Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : filteredFeatures.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {search || categoryFilter !== 'all'
                ? 'No feature toggles found matching your filters'
                : 'No feature toggles yet. Create your first feature toggle to get started.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredFeatures.map((feature) => (
            <Card key={feature.id} className="relative">
              <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                <div className="flex-1">
                  <CardTitle className="text-lg">{feature.name}</CardTitle>
                  <CardDescription className="mt-1.5">
                    {feature.description || 'No description provided'}
                  </CardDescription>
                </div>
                <Switch
                  checked={feature.enabled}
                  onCheckedChange={() => handleToggle(feature.id, feature.enabled)}
                  disabled={updatingId === feature.id}
                  className="mt-1"
                />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{feature.scope}</span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {feature.key}
                  </Badge>
                </div>
                {feature.category && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {feature.category}
                    </Badge>
                    <Badge 
                      variant={feature.enabled ? 'success' : 'secondary'}
                      className="text-xs"
                    >
                      {feature.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                )}
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  Last updated: {new Date(feature.updated_at).toLocaleString()}
                </div>
              </CardContent>
              {updatingId === feature.id && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-lg">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Summary */}
      {!loading && filteredFeatures.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {filteredFeatures.length} feature toggle{filteredFeatures.length !== 1 ? 's' : ''}
                {' • '}
                {filteredFeatures.filter(f => f.enabled).length} enabled
                {' • '}
                {filteredFeatures.filter(f => !f.enabled).length} disabled
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
