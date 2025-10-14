'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFacultyAssessments } from '@bitflow/api-client/faculty';
import { Button } from '@bitflow/ui/button';
import { Card } from '@bitflow/ui/card';
import { Badge } from '@bitflow/ui/badge';
import { DataTable } from '@bitflow/ui/data-table';
import { Plus, FileText, Eye, Edit, Trash2, Filter } from 'lucide-react';

export default function AssessmentsListPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    status: '',
    subject: '',
    type: '',
    page: 1,
  });

  const { data: assessments, isLoading, error } = useFacultyAssessments(filters);

  const columns = [
    {
      header: 'Title',
      accessorKey: 'title',
      cell: ({ row }: any) => (
        <div>
          <p className="font-medium">{row.original.title}</p>
          <p className="text-sm text-muted-foreground">{row.original.subject}</p>
        </div>
      ),
    },
    {
      header: 'Type',
      accessorKey: 'type',
      cell: ({ row }: any) => {
        const typeColors: Record<string, string> = {
          mcq: 'bg-blue-100 text-blue-800',
          saq: 'bg-green-100 text-green-800',
          laq: 'bg-purple-100 text-purple-800',
          assignment: 'bg-orange-100 text-orange-800',
          practical: 'bg-pink-100 text-pink-800',
        };
        return (
          <Badge className={typeColors[row.original.type] || ''}>
            {row.original.type.toUpperCase()}
          </Badge>
        );
      },
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }: any) => {
        const statusColors: Record<string, string> = {
          draft: 'bg-gray-100 text-gray-800',
          published: 'bg-green-100 text-green-800',
          ongoing: 'bg-blue-100 text-blue-800',
          completed: 'bg-purple-100 text-purple-800',
          archived: 'bg-red-100 text-red-800',
        };
        return (
          <Badge className={statusColors[row.original.status] || ''}>
            {row.original.status}
          </Badge>
        );
      },
    },
    {
      header: 'Due Date',
      accessorKey: 'due_date',
      cell: ({ row }: any) => {
        if (!row.original.due_date) return '-';
        return new Date(row.original.due_date).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
      },
    },
    {
      header: 'Submissions',
      accessorKey: 'submissions_count',
      cell: ({ row }: any) => (
        <div className="text-center">
          <span className="font-medium">{row.original.submissions_count || 0}</span>
          <span className="text-muted-foreground"> / {row.original.total_students || 0}</span>
        </div>
      ),
    },
    {
      header: 'Marks',
      accessorKey: 'max_marks',
      cell: ({ row }: any) => `${row.original.max_marks} marks`,
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/assessments/${row.original.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {row.original.status === 'draft' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/assessments/${row.original.id}/edit`)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {['published', 'ongoing', 'completed'].includes(row.original.status) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/assessments/${row.original.id}/grade`)}
            >
              <FileText className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="p-8">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading assessments...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error || !assessments?.success) {
    return (
      <div className="p-8">
        <Card className="p-6">
          <p className="text-destructive">Failed to load assessments</p>
        </Card>
      </div>
    );
  }

  const assessmentList = assessments.data || [];
  const meta = assessments.meta;

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Assessments</h1>
          <p className="text-muted-foreground">Manage and grade student assessments</p>
        </div>
        <Button onClick={() => router.push('/assessments/create')}>
          <Plus className="mr-2 h-4 w-4" />
          Create Assessment
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={filters.status}
            onChange={e => setFilters({ ...filters, status: e.target.value, page: 1 })}
            className="rounded-md border px-3 py-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
          <select
            value={filters.type}
            onChange={e => setFilters({ ...filters, type: e.target.value, page: 1 })}
            className="rounded-md border px-3 py-2 text-sm"
          >
            <option value="">All Types</option>
            <option value="mcq">MCQ</option>
            <option value="saq">SAQ</option>
            <option value="laq">LAQ</option>
            <option value="assignment">Assignment</option>
            <option value="practical">Practical</option>
          </select>
          <input
            type="text"
            placeholder="Subject..."
            value={filters.subject}
            onChange={e => setFilters({ ...filters, subject: e.target.value, page: 1 })}
            className="rounded-md border px-3 py-2 text-sm"
          />
          {(filters.status || filters.type || filters.subject) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters({ status: '', subject: '', type: '', page: 1 })}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="text-2xl font-bold">{assessmentList.length}</div>
          <p className="text-sm text-muted-foreground">Total Assessments</p>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">
            {assessmentList.filter((a: any) => a.status === 'ongoing').length}
          </div>
          <p className="text-sm text-muted-foreground">Ongoing</p>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-orange-600">
            {assessmentList.filter((a: any) => a.status === 'draft').length}
          </div>
          <p className="text-sm text-muted-foreground">Drafts</p>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {assessmentList.filter((a: any) => a.status === 'completed').length}
          </div>
          <p className="text-sm text-muted-foreground">Completed</p>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <DataTable columns={columns} data={assessmentList} />
      </Card>

      {/* Pagination */}
      {meta && meta.total > meta.per_page && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={meta.current_page === 1}
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {meta.current_page} of {Math.ceil(meta.total / meta.per_page)}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={meta.current_page >= Math.ceil(meta.total / meta.per_page)}
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
