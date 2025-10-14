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
} from '@bitflow/ui/card';
import { Badge } from '@bitflow/ui/badge';
import { Button } from '@bitflow/ui/button';
import { Input } from '@bitflow/ui/input';
import { Table } from '@bitflow/ui/table';
import { Search, Plus, Loader2, User } from 'lucide-react';

interface UserData {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  status: string;
  primary_role: string;
  created_at: string;
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export default function UsersPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
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
    fetchUsers();
  }, [token, search, roleFilter, statusFilter, pagination.current_page]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        page: pagination.current_page.toString(),
        per_page: pagination.per_page.toString(),
      });

      if (search) params.append('search', search);
      if (roleFilter !== 'all') params.append('role', roleFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.data.data);
      setPagination({
        current_page: data.data.current_page,
        last_page: data.data.last_page,
        per_page: data.data.per_page,
        total: data.data.total,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPagination({ ...pagination, current_page: 1 });
  };

  const handleRoleFilter = (role: string) => {
    setRoleFilter(role);
    setPagination({ ...pagination, current_page: 1 });
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setPagination({ ...pagination, current_page: 1 });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'secondary';
      case 'suspended':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    const roleColors: { [key: string]: string } = {
      admin: 'bg-red-100 text-red-800',
      faculty: 'bg-blue-100 text-blue-800',
      student: 'bg-green-100 text-green-800',
      parent: 'bg-purple-100 text-purple-800',
      none: 'bg-gray-100 text-gray-800',
    };
    return roleColors[role] || roleColors.none;
  };

  if (!token) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage users across the system
          </p>
        </div>
        <Button onClick={() => router.push('/users/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            {pagination.total} users in the system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or username..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          {/* Role Filters */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium">Role:</span>
            <Button
              size="sm"
              variant={roleFilter === 'all' ? 'default' : 'outline'}
              onClick={() => handleRoleFilter('all')}
            >
              All
            </Button>
            <Button
              size="sm"
              variant={roleFilter === 'admin' ? 'default' : 'outline'}
              onClick={() => handleRoleFilter('admin')}
            >
              Admin
            </Button>
            <Button
              size="sm"
              variant={roleFilter === 'faculty' ? 'default' : 'outline'}
              onClick={() => handleRoleFilter('faculty')}
            >
              Faculty
            </Button>
            <Button
              size="sm"
              variant={roleFilter === 'student' ? 'default' : 'outline'}
              onClick={() => handleRoleFilter('student')}
            >
              Student
            </Button>
            <Button
              size="sm"
              variant={roleFilter === 'parent' ? 'default' : 'outline'}
              onClick={() => handleRoleFilter('parent')}
            >
              Parent
            </Button>
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
              variant={statusFilter === 'inactive' ? 'default' : 'outline'}
              onClick={() => handleStatusFilter('inactive')}
            >
              Inactive
            </Button>
            <Button
              size="sm"
              variant={statusFilter === 'suspended' ? 'default' : 'outline'}
              onClick={() => handleStatusFilter('suspended')}
            >
              Suspended
            </Button>
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
                onClick={fetchUsers}
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          )}

          {/* Users Table */}
          {!loading && !error && users.length > 0 && (
            <div className="rounded-md border">
              <Table>
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left text-sm font-medium">Name</th>
                    <th className="p-4 text-left text-sm font-medium">
                      Username
                    </th>
                    <th className="p-4 text-left text-sm font-medium">Email</th>
                    <th className="p-4 text-left text-sm font-medium">Role</th>
                    <th className="p-4 text-left text-sm font-medium">
                      Status
                    </th>
                    <th className="p-4 text-left text-sm font-medium">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((userData) => (
                    <tr
                      key={userData.id}
                      className="cursor-pointer border-b transition-colors hover:bg-muted/50"
                      onClick={() => router.push(`/users/${userData.id}`)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {userData.first_name} {userData.last_name}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <code className="rounded bg-muted px-2 py-1 text-xs">
                          {userData.username}
                        </code>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {userData.email}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getRoleBadgeColor(userData.primary_role)}`}
                        >
                          {userData.primary_role}
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={getStatusBadgeVariant(userData.status)}
                        >
                          {userData.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(userData.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && users.length === 0 && (
            <div className="py-12 text-center">
              <User className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No users found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {search || roleFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Get started by adding your first user'}
              </p>
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && users.length > 0 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing{' '}
                {(pagination.current_page - 1) * pagination.per_page + 1} to{' '}
                {Math.min(
                  pagination.current_page * pagination.per_page,
                  pagination.total
                )}{' '}
                of {pagination.total} users
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
