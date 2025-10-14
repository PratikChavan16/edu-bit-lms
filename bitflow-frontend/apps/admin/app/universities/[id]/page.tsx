'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@bitflow/api-client/auth/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitflow/ui/card";
import { Badge } from "@bitflow/ui/badge";
import { Button } from "@bitflow/ui/button";
import { Separator } from "@bitflow/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@bitflow/ui/table";
import { Loader2, ArrowLeft, Edit, Trash2, Building2, Users, GraduationCap } from 'lucide-react';

interface College {
  id: number;
  name: string;
  code: string;
  status: string;
  students_count?: number;
  faculty_count?: number;
}

interface University {
  id: string;
  name: string;
  slug: string;
  domain: string;
  status: 'live' | 'staging' | 'suspended';
  timezone: string;
  branding?: {
    logo_url?: string;
    primary_color?: string;
  } | null;
  storage_quota_gb: number;
  storage_used_mb: number;
  last_backup_at?: string | null;
  created_at: string;
  updated_at: string;
  colleges?: College[];
  colleges_count: number;
  students_count?: number;
  faculty_count?: number;
  stats?: {
    colleges: number;
    students: number;
    faculty: number;
    activeUsers: number;
    storageUsedGb: number;
  };
}

const statusMap: Record<string, "success" | "warning" | "secondary"> = {
  active: "success",
  inactive: "secondary",
  pending: "warning",
};

export default function UniversityDetailPage() {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const universityId = params.id as string;
  
  const [university, setUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    fetchUniversity();
  }, [isAuthenticated, universityId]);

  const fetchUniversity = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/universities/${universityId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch university details');
      }
      
      const result = await response.json();
      
      // Handle standardized API response format: { data: {...} }
      // Fallback to old formats for backwards compatibility
      const universityData = result.data || result;
      setUniversity(universityData);
    } catch (err) {
      console.error('Error fetching university:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch university');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this university? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/universities/${universityId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to delete university');
      }
      
      router.push('/universities');
    } catch (err) {
      console.error('Error deleting university:', err);
      alert('Failed to delete university. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !university) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.push('/universities')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Universities
        </Button>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-red-800">{error || 'University not found'}</p>
              <Button variant="outline" size="sm" onClick={fetchUniversity}>
                Retry
              </Button>
            </div>
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
          <Button variant="ghost" size="sm" onClick={() => router.push('/universities')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">{university.name}</h1>
            <p className="text-muted-foreground">
              Slug: {university.slug} • Domain: {university.domain || 'N/A'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {/* <Button variant="outline" onClick={() => router.push(`/universities/${universityId}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button> */}
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Colleges</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{university.colleges_count}</div>
            <p className="text-xs text-muted-foreground">
              Affiliated colleges
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {university.students_count || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all colleges
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Faculty</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {university.faculty_count || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Teaching staff
            </p>
          </CardContent>
        </Card>
      </div>

      {/* University Details */}
      <Card>
        <CardHeader>
          <CardTitle>University Information</CardTitle>
          <CardDescription>Basic details and system information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge variant={statusMap[university.status]} className="mt-1">
                {university.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Domain</p>
              <p className="mt-1 font-mono text-sm">{university.domain || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Timezone</p>
              <p className="mt-1">{university.timezone}</p>
            </div>
            {university.stats && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Storage Used</p>
                <p className="mt-1">{university.stats.storageUsedGb} GB of {university.storage_quota_gb} GB</p>
              </div>
            )}
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created At</p>
              <p className="mt-1">
                {new Date(university.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
              <p className="mt-1">
                {new Date(university.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Colleges List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Affiliated Colleges</CardTitle>
              <CardDescription>
                {university.colleges?.length || 0} college(s) under this university
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => router.push(`/colleges/new?university_id=${universityId}`)}>
              Add College
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!university.colleges || university.colleges.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                No colleges affiliated yet. Add the first college to get started.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Students</TableHead>
                  <TableHead className="text-right">Faculty</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {university.colleges.map((college) => (
                  <TableRow
                    key={college.id}
                    className="cursor-pointer hover:bg-muted/40"
                    onClick={() => router.push(`/colleges/${college.id}`)}
                  >
                    <TableCell className="font-medium">{college.name}</TableCell>
                    <TableCell className="text-muted-foreground">{college.code}</TableCell>
                    <TableCell>
                      <Badge variant={statusMap[college.status] ?? 'secondary'}>
                        {college.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {college.students_count || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      {college.faculty_count || 0}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
