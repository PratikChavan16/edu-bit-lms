'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useUniversityContext } from '@/contexts/UniversityContext';
import { useCollegeContext } from '@/contexts/CollegeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, Edit, Trash2, AlertCircle, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface Exam {
  id: string;
  name: string;
  exam_code: string;
  exam_type: string;
  start_date: string;
  end_date: string;
  semester: number;
  year: number;
  total_marks: number;
  passing_marks: number;
  status: string;
  department?: {
    id: string;
    name: string;
  };
}

interface PaginationMetadata {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export default function ExamsPage() {
  const params = useParams();
  const { selectedUniversity } = useUniversityContext();
  const { selectedCollege } = useCollegeContext();

  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [examTypeFilter, setExamTypeFilter] = useState('all');
  const [pagination, setPagination] = useState<PaginationMetadata>({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    exam_code: '',
    exam_type: 'mid_term',
    start_date: '',
    end_date: '',
    semester: 1,
    year: 2024,
    total_marks: 100,
    passing_marks: 40,
    description: '',
    status: 'scheduled',
  });

  useEffect(() => {
    fetchExams();
  }, [selectedUniversity, selectedCollege, searchQuery, statusFilter, examTypeFilter, pagination.current_page]);

  const fetchExams = async () => {
    if (!selectedUniversity || !selectedCollege) return;

    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.current_page.toString(),
        per_page: pagination.per_page.toString(),
      });

      if (searchQuery) queryParams.append('search', searchQuery);
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);
      if (examTypeFilter !== 'all') queryParams.append('exam_type', examTypeFilter);

      const response = await fetch(
        `/api/v1/admin/universities/${selectedUniversity.id}/colleges/${selectedCollege.id}/exams?${queryParams}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Request-ID': `req_${Date.now()}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setExams(data.data);
        if (data.metadata?.pagination) {
          setPagination(data.metadata.pagination);
        }
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUniversity || !selectedCollege) return;

    try {
      const url = editingExam
        ? `/api/v1/admin/universities/${selectedUniversity.id}/colleges/${selectedCollege.id}/exams/${editingExam.id}`
        : `/api/v1/admin/universities/${selectedUniversity.id}/colleges/${selectedCollege.id}/exams`;

      const response = await fetch(url, {
        method: editingExam ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': `req_${Date.now()}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setIsDialogOpen(false);
        resetForm();
        fetchExams();
      }
    } catch (error) {
      console.error('Error saving exam:', error);
    }
  };

  const handleDelete = async (examId: string) => {
    if (!confirm('Are you sure you want to delete this exam?')) return;
    if (!selectedUniversity || !selectedCollege) return;

    try {
      const response = await fetch(
        `/api/v1/admin/universities/${selectedUniversity.id}/colleges/${selectedCollege.id}/exams/${examId}`,
        {
          method: 'DELETE',
          headers: {
            'X-Request-ID': `req_${Date.now()}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        fetchExams();
      }
    } catch (error) {
      console.error('Error deleting exam:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      exam_code: '',
      exam_type: 'mid_term',
      start_date: '',
      end_date: '',
      semester: 1,
      year: 2024,
      total_marks: 100,
      passing_marks: 40,
      description: '',
      status: 'scheduled',
    });
    setEditingExam(null);
  };

  const openEditDialog = (exam: Exam) => {
    setEditingExam(exam);
    setFormData({
      name: exam.name,
      exam_code: exam.exam_code,
      exam_type: exam.exam_type,
      start_date: exam.start_date,
      end_date: exam.end_date,
      semester: exam.semester,
      year: exam.year,
      total_marks: exam.total_marks,
      passing_marks: exam.passing_marks,
      description: '',
      status: exam.status,
    });
    setIsDialogOpen(true);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'default';
      case 'ongoing':
        return 'secondary';
      case 'completed':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getExamTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      mid_term: 'Mid Term',
      end_term: 'End Term',
      internal: 'Internal',
      external: 'External',
      practical: 'Practical',
    };
    return labels[type] || type;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* God Mode Banner */}
      {selectedUniversity && (
        <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-200">
            <strong>God Mode Active:</strong> Viewing exams for{' '}
            <strong>{selectedCollege?.name}</strong> at{' '}
            <strong>{selectedUniversity.name}</strong>
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Examinations</h1>
          <p className="text-muted-foreground">
            Manage exam schedules, results, and analytics
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Exam
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingExam ? 'Edit Exam' : 'Add New Exam'}
              </DialogTitle>
              <DialogDescription>
                {editingExam
                  ? 'Update exam details below'
                  : 'Fill in the exam information below'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Exam Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exam_code">Exam Code *</Label>
                  <Input
                    id="exam_code"
                    value={formData.exam_code}
                    onChange={(e) =>
                      setFormData({ ...formData, exam_code: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="exam_type">Exam Type *</Label>
                  <Select
                    value={formData.exam_type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, exam_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mid_term">Mid Term</SelectItem>
                      <SelectItem value="end_term">End Term</SelectItem>
                      <SelectItem value="internal">Internal</SelectItem>
                      <SelectItem value="external">External</SelectItem>
                      <SelectItem value="practical">Practical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date *</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date *</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) =>
                      setFormData({ ...formData, end_date: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="semester">Semester *</Label>
                  <Select
                    value={formData.semester.toString()}
                    onValueChange={(value) =>
                      setFormData({ ...formData, semester: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <SelectItem key={sem} value={sem.toString()}>
                          Semester {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: parseInt(e.target.value) })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="total_marks">Total Marks *</Label>
                  <Input
                    id="total_marks"
                    type="number"
                    value={formData.total_marks}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        total_marks: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passing_marks">Passing Marks *</Label>
                  <Input
                    id="passing_marks"
                    type="number"
                    value={formData.passing_marks}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        passing_marks: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingExam ? 'Update Exam' : 'Create Exam'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={examTypeFilter} onValueChange={setExamTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="mid_term">Mid Term</SelectItem>
            <SelectItem value="end_term">End Term</SelectItem>
            <SelectItem value="internal">Internal</SelectItem>
            <SelectItem value="external">External</SelectItem>
            <SelectItem value="practical">Practical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Exam Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Semester</TableHead>
              <TableHead>Marks</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : exams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No exams found</p>
                </TableCell>
              </TableRow>
            ) : (
              exams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.name}</TableCell>
                  <TableCell>{exam.exam_code}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getExamTypeLabel(exam.exam_type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {format(new Date(exam.start_date), 'MMM dd')} -{' '}
                    {format(new Date(exam.end_date), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>Sem {exam.semester}</TableCell>
                  <TableCell>
                    {exam.total_marks} ({exam.passing_marks} min)
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(exam.status)}>
                      {exam.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(exam)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(exam.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.last_page > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(pagination.current_page - 1) * pagination.per_page + 1} to{' '}
            {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of{' '}
            {pagination.total} exams
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination({
                  ...pagination,
                  current_page: pagination.current_page - 1,
                })
              }
              disabled={pagination.current_page === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {pagination.current_page} of {pagination.last_page}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination({
                  ...pagination,
                  current_page: pagination.current_page + 1,
                })
              }
              disabled={pagination.current_page === pagination.last_page}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
