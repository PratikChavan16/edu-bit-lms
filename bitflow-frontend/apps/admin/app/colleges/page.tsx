'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@bitflow/api-client/auth/useAuth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@bitflow/ui';
import { Badge } from '@bitflow/ui';
import { Button } from '@bitflow/ui';
import { Input } from '@bitflow/ui';
import { Table } from '@bitflow/ui';
import { Search, Plus, Loader2, Building2 } from 'lucide-react';

interface College {
  id: string;
  name: string;
  code: string;
  type: string;
  status: string;
  university: {
    id: string;
    name: string;
    code: string;
  };
  students_count: number;
  faculty_count: number;
  created_at: string;
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export default function CollegesPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [pagination, setPagination] = useState<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    fetchColleges();
  }, [token, search, statusFilter, typeFilter, pagination.current_page]);

  const fetchColleges = async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        page: pagination.current_page.toString(),
        per_page: pagination.per_page.toString(),
      });

      if (search) params.append('search', search);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (typeFilter !== 'all') params.append('type', typeFilter);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/colleges?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch colleges');
      }

      const data = await response.json();
      setColleges(data.data.data);
      setPagination({
        current_page: data.data.current_page,
        last_page: data.data.last_page,
        per_page: data.data.per_page,
        total: data.data.total,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load colleges');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPagination({ ...pagination, current_page: 1 });
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setPagination({ ...pagination, current_page: 1 });
  };

  const handleTypeFilter = (type: string) => {
    setTypeFilter(type);
    setPagination({ ...pagination, current_page: 1 });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'inactive':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    const typeColors: { [key: string]: string } = {
      engineering: 'bg-blue-100 text-blue-800',
      arts: 'bg-purple-100 text-purple-800',
      science: 'bg-green-100 text-green-800',
      commerce: 'bg-yellow-100 text-yellow-800',
      medical: 'bg-red-100 text-red-800',
      law: 'bg-gray-100 text-gray-800',
      management: 'bg-indigo-100 text-indigo-800',
      other: 'bg-slate-100 text-slate-800',
    };
    return typeColors[type] || typeColors.other;
  };

  const collegeTypes = [
    'engineering',
    'arts',
    'science',
    'commerce',
    'medical',
    'law',
    'management',
    'other',
  ];

  if (!token) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Colleges</h1>
          <p className="text-muted-foreground">
            Manage colleges across all universities
          </p>
        </div>
        <Button onClick={() => router.push('/colleges/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add College
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Colleges</CardTitle>
          <CardDescription>
            {pagination.total} colleges in the system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search colleges by name or code..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium">Status:</span>
            <Button
              size="sm"
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              onClick={() => handleStatusFilter('all')}
            >
              All
            </Button>
            <Button
              size="sm"
              variant={statusFilter === 'active' ? 'default' : 'outline'}
              onClick={() => handleStatusFilter('active')}
            >
              Active
            </Button>
            <Button
              size="sm"
              variant={statusFilter === 'pending' ? 'default' : 'outline'}
              onClick={() => handleStatusFilter('pending')}
            >
              Pending
            </Button>
            <Button
              size="sm"
              variant={statusFilter === 'inactive' ? 'default' : 'outline'}
              onClick={() => handleStatusFilter('inactive')}
            >
              Inactive
            </Button>
          </div>

          {/* Type Filters */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium">Type:</span>
            <Button
              size="sm"
              variant={typeFilter === 'all' ? 'default' : 'outline'}
              onClick={() => handleTypeFilter('all')}
            >
              All Types
            </Button>
            {collegeTypes.map((type) => (
              <Button
                key={type}
                size="sm"
                variant={typeFilter === type ? 'default' : 'outline'}
                onClick={() => handleTypeFilter(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="rounded-md bg-destructive/10 p-4 text-center">
              <p className="text-sm text-destructive">{error}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={fetchColleges}
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          )}

          {/* Colleges Table */}
          {!loading && !error && colleges.length > 0 && (
            <div className="rounded-md border">
              <Table>
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left text-sm font-medium">Name</th>
                    <th className="p-4 text-left text-sm font-medium">Code</th>
                    <th className="p-4 text-left text-sm font-medium">
                      University
                    </th>
                    <th className="p-4 text-left text-sm font-medium">Type</th>
                    <th className="p-4 text-left text-sm font-medium">
                      Status
                    </th>
                    <th className="p-4 text-left text-sm font-medium">
                      Students
                    </th>
                    <th className="p-4 text-left text-sm font-medium">
                      Faculty
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {colleges.map((college) => (
                    <tr
                      key={college.id}
                      className="cursor-pointer border-b transition-colors hover:bg-muted/50"
                      onClick={() => router.push(`/colleges/${college.id}`)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{college.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <code className="rounded bg-muted px-2 py-1 text-xs">
                          {college.code}
                        </code>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {college.university.name}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getTypeBadgeVariant(college.type)}`}
                        >
                          {college.type}
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge variant={getStatusBadgeVariant(college.status)}>
                          {college.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm">{college.students_count}</td>
                      <td className="p-4 text-sm">{college.faculty_count}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && colleges.length === 0 && (
            <div className="py-12 text-center">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No colleges found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {search || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Get started by adding your first college'}
              </p>
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && colleges.length > 0 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {(pagination.current_page - 1) * pagination.per_page + 1}{' '}
                to{' '}
                {Math.min(
                  pagination.current_page * pagination.per_page,
                  pagination.total
                )}{' '}
                of {pagination.total} colleges
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.current_page === 1}
                  onClick={() =>
                    setPagination({
                      ...pagination,
                      current_page: pagination.current_page - 1,
                    })
                  }
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.current_page === pagination.last_page}
                  onClick={() =>
                    setPagination({
                      ...pagination,
                      current_page: pagination.current_page + 1,
                    })
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
