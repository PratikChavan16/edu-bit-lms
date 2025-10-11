'use client';

import { useState } from 'react';
import { useLearnerAssessments } from '@bitflow/api-client/learner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitflow/ui/card";
import { Badge } from "@bitflow/ui/badge";
import { Button } from "@bitflow/ui/button";
import { DataTable } from "@bitflow/ui/data-table";
import { Select } from "@bitflow/ui/select";
import { AlertCircle, FileText, Calendar, Clock, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AssessmentsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  const { data, isLoading, error } = useLearnerAssessments(
    statusFilter ? { status: statusFilter } : undefined
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-32 animate-pulse rounded-lg bg-muted" />
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
          <h2 className="mt-4 text-lg font-semibold">Failed to load assessments</h2>
          <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const assessments = data?.data || [];

  const statusColors: Record<string, string> = {
    upcoming: 'bg-blue-100 text-blue-800',
    ongoing: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    missed: 'bg-red-100 text-red-800',
  };

  const submissionColors: Record<string, string> = {
    not_started: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    submitted: 'bg-blue-100 text-blue-800',
    graded: 'bg-green-100 text-green-800',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle>Assessments</CardTitle>
              </div>
              <CardDescription className="mt-2">
                View and attempt your assessments • {assessments.length} total
              </CardDescription>
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'All Status' },
                { value: 'upcoming', label: 'Upcoming' },
                { value: 'ongoing', label: 'Ongoing' },
                { value: 'completed', label: 'Completed' },
                { value: 'missed', label: 'Missed' },
              ]}
              placeholder="Filter by status"
            />
          </div>
        </CardHeader>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-blue-100 p-3">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {assessments.filter((a) => a.status === 'upcoming').length}
                </p>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-green-100 p-3">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {assessments.filter((a) => a.status === 'ongoing').length}
                </p>
                <p className="text-sm text-muted-foreground">Ongoing</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-gray-100 p-3">
                <FileText className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {assessments.filter((a) => a.status === 'completed').length}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-purple-100 p-3">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {assessments.filter((a) => a.submission_status === 'graded').length}
                </p>
                <p className="text-sm text-muted-foreground">Graded</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assessments Table */}
      <Card>
        <CardContent className="p-6">
          {assessments.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">No assessments found</p>
            </div>
          ) : (
            <DataTable
              data={assessments}
              columns={[
                {
                  key: 'title',
                  label: 'Title',
                  sortable: true,
                  render: (row) => (
                    <div>
                      <p className="font-medium">{row.title}</p>
                      <p className="text-sm text-muted-foreground">{row.subject}</p>
                    </div>
                  ),
                },
                {
                  key: 'type',
                  label: 'Type',
                  render: (row) => (
                    <Badge variant="outline" className="capitalize">
                      {row.type}
                    </Badge>
                  ),
                },
                {
                  key: 'total_marks',
                  label: 'Marks',
                  render: (row) => (
                    <span className="font-medium">{row.total_marks}</span>
                  ),
                },
                {
                  key: 'ends_at',
                  label: 'Due Date',
                  sortable: true,
                  render: (row) => (
                    <div className="text-sm">
                      {new Date(row.ends_at).toLocaleDateString()}
                    </div>
                  ),
                },
                {
                  key: 'status',
                  label: 'Status',
                  render: (row) => (
                    <Badge className={statusColors[row.status] || ''}>
                      {row.status}
                    </Badge>
                  ),
                },
                {
                  key: 'submission_status',
                  label: 'Submission',
                  render: (row) => (
                    row.submission_status ? (
                      <Badge className={submissionColors[row.submission_status] || ''}>
                        {row.submission_status.replace('_', ' ')}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )
                  ),
                },
                {
                  key: 'score',
                  label: 'Score',
                  render: (row) => (
                    row.score !== undefined ? (
                      <span className="font-semibold">{row.score}%</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )
                  ),
                },
                {
                  key: 'actions',
                  label: 'Actions',
                  render: (row) => (
                    <div className="flex gap-2">
                      {row.status === 'ongoing' && row.submission_status !== 'submitted' && (
                        <Button
                          size="sm"
                          onClick={() => router.push(`/assessments/${row.id}/attempt`)}
                        >
                          Attempt
                        </Button>
                      )}
                      {row.submission_status === 'graded' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/assessments/${row.id}`)}
                        >
                          View
                        </Button>
                      )}
                      {row.status === 'upcoming' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => router.push(`/assessments/${row.id}`)}
                        >
                          Details
                        </Button>
                      )}
                    </div>
                  ),
                },
              ]}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
