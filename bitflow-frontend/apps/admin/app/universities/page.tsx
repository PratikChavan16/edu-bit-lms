'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@bitflow/api-client/auth/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitflow/ui/card";
import { Badge } from "@bitflow/ui/badge";
import { Button } from "@bitflow/ui/button";
import { Input } from "@bitflow/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@bitflow/ui/table";
import { Loader2, Search, Plus, Filter } from 'lucide-react';

interface University {
  id: number;
  name: string;
  code: string;
  status: 'active' | 'inactive';
  colleges_count: number;
  accreditation_level: string;
  state?: {
    name: string;
  };
  created_at: string;
}

interface PaginatedResponse {
  data: University[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

const statusMap: Record<string, "success" | "warning" | "secondary"> = {
  active: "success",
  inactive: "secondary",
};

export default function UniversitiesPage() {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Fetch universities
  useEffect(() => {
    if (!isAuthenticated) return;
    
    fetchUniversities();
  }, [isAuthenticated, search, statusFilter, pagination.currentPage]);

  const fetchUniversities = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        per_page: '10',
      });
      
      if (search) {
        params.append('search', search);
      }
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/universities?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch universities');
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        const paginatedData = result.data as PaginatedResponse;
        setUniversities(paginatedData.data);
        setPagination({
          currentPage: paginatedData.current_page,
          lastPage: paginatedData.last_page,
          total: paginatedData.total,
        });
      }
    } catch (err) {
      console.error('Error fetching universities:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch universities');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to page 1
  };

  const handleStatusFilterChange = (status: 'all' | 'active' | 'inactive') => {
    setStatusFilter(status);
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to page 1
  };

  const handleRowClick = (id: number) => {
    router.push(`/universities/${id}`);
  };

  if (loading && universities.length === 0) {
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
          <h1 className="text-2xl font-semibold">Universities</h1>
          <p className="text-muted-foreground">
            Manage universities, feature toggles, quotas, and provisioning.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled>
            Import CSV
          </Button>
          <Button onClick={() => router.push('/universities/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Add University
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search universities by name or code..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusFilterChange('all')}
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusFilterChange('active')}
          >
            Active
          </Button>
          <Button
            variant={statusFilter === 'inactive' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusFilterChange('inactive')}
          >
            Inactive
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-red-800">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchUniversities}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Universities Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Universities Overview
            {pagination.total > 0 && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({pagination.total} total)
              </span>
            )}
          </CardTitle>
          <CardDescription>
            Click on any university to view details and manage colleges
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : universities.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                {search || statusFilter !== 'all'
                  ? 'No universities found matching your filters'
                  : 'No universities yet. Add your first university to get started.'}
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Colleges</TableHead>
                    <TableHead>Accreditation</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {universities.map((university) => (
                    <TableRow
                      key={university.id}
                      className="cursor-pointer hover:bg-muted/40"
                      onClick={() => handleRowClick(university.id)}
                    >
                      <TableCell className="font-medium">{university.name}</TableCell>
                      <TableCell className="text-muted-foreground">{university.code}</TableCell>
                      <TableCell>{university.state?.name || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={statusMap[university.status] ?? 'secondary'}>
                          {university.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{university.colleges_count}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{university.accreditation_level}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(university.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination.lastPage > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-muted-foreground">
                    Page {pagination.currentPage} of {pagination.lastPage}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                      disabled={pagination.currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                      disabled={pagination.currentPage === pagination.lastPage}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
