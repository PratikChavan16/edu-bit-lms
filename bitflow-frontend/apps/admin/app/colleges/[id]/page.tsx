'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
import { Separator } from '@bitflow/ui/separator';
import { Table } from '@bitflow/ui/table';
import {
  ArrowLeft,
  Building2,
  Users,
  GraduationCap,
  FolderTree,
  BookOpen,
  Edit,
  Trash2,
  CheckCircle,
  Loader2,
  HardDrive,
} from 'lucide-react';

interface College {
  id: string;
  name: string;
  slug: string;
  code: string;
  type: string;
  status: string;
  motto: string;
  storage_quota_gb: number;
  student_storage_quota_mb: number;
  branding: {
    logo_url?: string;
    primary_color?: string;
    secondary_color?: string;
  };
  university: {
    id: string;
    name: string;
    code: string;
  };
  departments: Array<{
    id: string;
    name: string;
    code: string;
  }>;
  students_count: number;
  faculty_count: number;
  departments_count: number;
  courses_count: number;
  created_by?: {
    first_name: string;
    last_name: string;
  };
  created_at: string;
  updated_at: string;
}

interface Statistics {
  students_count: number;
  faculty_count: number;
  departments_count: number;
  courses_count: number;
  storage_used_gb: number;
  storage_quota_gb: number;
  storage_percentage: number;
}

export default function CollegeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuth();
  const [college, setCollege] = useState<College | null>(null);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    if (params.id) {
      fetchCollege();
      fetchStatistics();
    }
  }, [token, params.id]);

  const fetchCollege = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/colleges/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch college');
      }

      const data = await response.json();
      setCollege(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load college');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/colleges/${params.id}/statistics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStatistics(data.data);
      }
    } catch (err) {
      // Silently fail, statistics are optional
      console.error('Failed to fetch statistics:', err);
    }
  };

  const handleApprove = async () => {
    if (!confirm('Are you sure you want to approve this college?')) {
      return;
    }

    setApproving(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/colleges/${params.id}/approve`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to approve college');
      }

      // Refresh college data
      await fetchCollege();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to approve college');
    } finally {
      setApproving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        'Are you sure you want to delete this college? This action cannot be undone.'
      )
    ) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/colleges/${params.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete college');
      }

      router.push('/colleges');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete college');
    } finally {
      setDeleting(false);
    }
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

  if (!token) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.push('/colleges')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Colleges
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive">{error || 'College not found'}</p>
            <Button onClick={fetchCollege} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/colleges')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {college.name}
              </h1>
              <Badge variant={getStatusBadgeVariant(college.status)}>
                {college.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {college.university.name} • {college.code}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {college.status === 'pending' && (
            <Button onClick={handleApprove} disabled={approving}>
              {approving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              Approve College
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => router.push(`/colleges/${college.id}/edit` as any)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Delete
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistics.students_count}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Faculty
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistics.faculty_count}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <FolderTree className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistics.departments_count}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistics.courses_count}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* College Information */}
      <Card>
        <CardHeader>
          <CardTitle>College Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                College Code
              </label>
              <p className="mt-1">{college.code}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Type
              </label>
              <p className="mt-1 capitalize">{college.type}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                University
              </label>
              <p className="mt-1">{college.university.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Status
              </label>
              <div className="mt-1">
                <Badge variant={getStatusBadgeVariant(college.status)}>
                  {college.status}
                </Badge>
              </div>
            </div>
            {college.motto && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Motto
                </label>
                <p className="mt-1 italic">{college.motto}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Storage Information */}
          {statistics && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">Storage Information</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Used
                  </label>
                  <p className="mt-1">{statistics.storage_used_gb.toFixed(2)} GB</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Quota
                  </label>
                  <p className="mt-1">{statistics.storage_quota_gb} GB</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Usage
                  </label>
                  <p className="mt-1">{statistics.storage_percentage.toFixed(1)}%</p>
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.min(statistics.storage_percentage, 100)}%` }}
                />
              </div>
            </div>
          )}

          <Separator />

          {/* Metadata */}
          <div className="grid gap-4 md:grid-cols-2">
            {college.created_by && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Created By
                </label>
                <p className="mt-1">
                  {college.created_by.first_name} {college.created_by.last_name}
                </p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Created At
              </label>
              <p className="mt-1">
                {new Date(college.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Departments */}
      {college.departments && college.departments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Departments</CardTitle>
            <CardDescription>
              {college.departments.length} departments in this college
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left text-sm font-medium">Name</th>
                    <th className="p-4 text-left text-sm font-medium">Code</th>
                  </tr>
                </thead>
                <tbody>
                  {college.departments.map((dept) => (
                    <tr
                      key={dept.id}
                      className="cursor-pointer border-b transition-colors hover:bg-muted/50"
                      onClick={() => router.push(`/departments/${dept.id}` as any)}
                    >
                      <td className="p-4 font-medium">{dept.name}</td>
                      <td className="p-4">
                        <code className="rounded bg-muted px-2 py-1 text-xs">
                          {dept.code}
                        </code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
