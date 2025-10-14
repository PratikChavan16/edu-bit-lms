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
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Shield,
  Edit,
  Trash2,
  Key,
  Loader2,
  CheckCircle,
  XCircle,
  Building2,
} from 'lucide-react';

interface UserData {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  date_of_birth: string;
  photo_url: string;
  status: string;
  primary_role: string;
  last_login_at: string;
  created_at: string;
  updated_at: string;
  roles: Array<{
    id: string;
    name: string;
    slug: string;
    scope: string;
    pivot: {
      university_id?: string;
      college_id?: string;
    };
  }>;
  student?: {
    id: string;
    college: {
      id: string;
      name: string;
      university: {
        id: string;
        name: string;
      };
    };
  };
  faculty?: {
    id: string;
    college: {
      id: string;
      name: string;
      university: {
        id: string;
        name: string;
      };
    };
  };
}

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    if (params.id) {
      fetchUser();
    }
  }, [token, params.id]);

  const fetchUser = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      const data = await response.json();
      setUserData(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        'Are you sure you want to delete this user? This action will deactivate the user account.'
      )
    ) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${params.id}`,
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
        throw new Error(errorData.error || 'Failed to delete user');
      }

      router.push('/users');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  const handleResetPassword = () => {
    // TODO: Implement password reset modal
    alert('Password reset functionality will be implemented here');
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
    };
    return roleColors[role] || 'bg-gray-100 text-gray-800';
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

  if (error || !userData) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.push('/users')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive">{error || 'User not found'}</p>
            <Button onClick={fetchUser} className="mt-4">
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
          <Button variant="ghost" onClick={() => router.push('/users')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {userData.first_name} {userData.last_name}
              </h1>
              <Badge variant={getStatusBadgeVariant(userData.status)}>
                {userData.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">@{userData.username}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleResetPassword}>
            <Key className="mr-2 h-4 w-4" />
            Reset Password
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/users/${userData.id}/edit` as any)}
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

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Full Name
                </label>
                <p className="mt-1">
                  {userData.first_name} {userData.last_name}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Username
                </label>
                <p className="mt-1">@{userData.username}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <p className="mt-1">
                  <a
                    href={`mailto:${userData.email}`}
                    className="text-primary hover:underline"
                  >
                    {userData.email}
                  </a>
                </p>
              </div>
            </div>
            {userData.phone && (
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Phone
                  </label>
                  <p className="mt-1">
                    <a
                      href={`tel:${userData.phone}`}
                      className="text-primary hover:underline"
                    >
                      {userData.phone}
                    </a>
                  </p>
                </div>
              </div>
            )}
            {userData.date_of_birth && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Date of Birth
                </label>
                <p className="mt-1">
                  {new Date(userData.date_of_birth).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Status
              </label>
              <div className="mt-1">
                <Badge variant={getStatusBadgeVariant(userData.status)}>
                  {userData.status}
                </Badge>
              </div>
            </div>
          </div>

          {userData.last_login_at && (
            <>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Last Login
                </label>
                <p className="mt-1">
                  {new Date(userData.last_login_at).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Roles & Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Roles & Permissions
          </CardTitle>
          <CardDescription>
            User roles and their associated context
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userData.roles && userData.roles.length > 0 ? (
            <div className="space-y-3">
              {userData.roles.map((role) => (
                <div
                  key={role.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getRoleBadgeColor(role.slug)}`}
                    >
                      {role.name}
                    </span>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Scope:</span> {role.scope}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {role.pivot.university_id && (
                      <Badge variant="outline">
                        University Context
                      </Badge>
                    )}
                    {role.pivot.college_id && (
                      <Badge variant="outline">College Context</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              No roles assigned
            </p>
          )}
        </CardContent>
      </Card>

      {/* Student/Faculty Information */}
      {(userData.student || userData.faculty) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {userData.student ? 'Student' : 'Faculty'} Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userData.student && (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    College
                  </label>
                  <p className="mt-1">
                    <button
                      onClick={() =>
                        router.push(`/colleges/${userData.student!.college.id}`)
                      }
                      className="text-primary hover:underline"
                    >
                      {userData.student.college.name}
                    </button>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    University
                  </label>
                  <p className="mt-1">
                    <button
                      onClick={() =>
                        router.push(
                          `/universities/${userData.student!.college.university.id}`
                        )
                      }
                      className="text-primary hover:underline"
                    >
                      {userData.student.college.university.name}
                    </button>
                  </p>
                </div>
              </div>
            )}
            {userData.faculty && (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    College
                  </label>
                  <p className="mt-1">
                    <button
                      onClick={() =>
                        router.push(`/colleges/${userData.faculty!.college.id}`)
                      }
                      className="text-primary hover:underline"
                    >
                      {userData.faculty.college.name}
                    </button>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    University
                  </label>
                  <p className="mt-1">
                    <button
                      onClick={() =>
                        router.push(
                          `/universities/${userData.faculty!.college.university.id}`
                        )
                      }
                      className="text-primary hover:underline"
                    >
                      {userData.faculty.college.university.name}
                    </button>
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Account Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Created At
              </label>
              <p className="mt-1">
                {new Date(userData.created_at).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Last Updated
              </label>
              <p className="mt-1">
                {new Date(userData.updated_at).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
