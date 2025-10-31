'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useUniversity } from '@/contexts/UniversityContext';
import { useCollege } from '@/contexts/CollegeContext';
import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types';
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
import { Modal } from '@/components/ui/modal';
import { Select, SelectOption } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, Edit, Trash2, FileText } from 'lucide-react';

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

const examTypeOptions: SelectOption[] = [
  { label: 'Mid Term', value: 'mid_term' },
  { label: 'End Term', value: 'end_term' },
  { label: 'Internal', value: 'internal' },
  { label: 'External', value: 'external' },
  { label: 'Practical', value: 'practical' },
];

const statusOptions: SelectOption[] = [
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'Ongoing', value: 'ongoing' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

const semesterOptions: SelectOption[] = Array.from({ length: 8 }, (_, i) => ({
  label: `Semester ${i + 1}`,
  value: String(i + 1),
}));

const filterStatusOptions: SelectOption[] = [
  { label: 'All Statuses', value: 'all' },
  ...statusOptions,
];

const filterExamTypeOptions: SelectOption[] = [
  { label: 'All Types', value: 'all' },
  ...examTypeOptions,
];

export default function ExamsPage() {
  const params = useParams();
  const { university } = useUniversity();
  const { college } = useCollege();

  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    semester: '1',
    year: new Date().getFullYear(),
    total_marks: 100,
    passing_marks: 40,
    description: '',
    status: 'scheduled',
  });

  useEffect(() => {
    if (university && college) {
      fetchExams();
    }
  }, [university, college, searchQuery, statusFilter, examTypeFilter, pagination.current_page]);

  const fetchExams = async () => {
    if (!university || !college) return;

    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.current_page.toString(),
        per_page: pagination.per_page.toString(),
      });

      if (searchQuery) queryParams.append('search', searchQuery);
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);
      if (examTypeFilter !== 'all') queryParams.append('exam_type', examTypeFilter);

      const data = await apiClient.get<ApiResponse<Exam[]>>(
        `/admin/universities/${university.id}/colleges/${college.id}/exams?${queryParams}`
      );

      if (data.success) {
        setExams(data.data);
        if (data.meta) {
          setPagination({
            current_page: data.meta.current_page,
            last_page: data.meta.last_page,
            per_page: data.meta.per_page,
            total: data.meta.total,
          });
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

    if (!university || !college) return;

    try {
      const url = editingExam
        ? `/admin/universities/${university.id}/colleges/${college.id}/exams/${editingExam.id}`
        : `/admin/universities/${university.id}/colleges/${college.id}/exams`;

      const payload = {
        ...formData,
        semester: parseInt(formData.semester),
      };

      const data = editingExam
        ? await apiClient.put<ApiResponse<Exam>>(url, payload)
        : await apiClient.post<ApiResponse<Exam>>(url, payload);

      if (data.success) {
        setIsModalOpen(false);
        resetForm();
        fetchExams();
      }
    } catch (error) {
      console.error('Error saving exam:', error);
    }
  };

  const handleDelete = async (examId: string) => {
    if (!confirm('Are you sure you want to delete this exam?')) return;
    if (!university || !college) return;

    try {
      const data = await apiClient.delete<ApiResponse<void>>(
        `/admin/universities/${university.id}/colleges/${college.id}/exams/${examId}`
      );

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
      semester: '1',
      year: new Date().getFullYear(),
      total_marks: 100,
      passing_marks: 40,
      description: '',
      status: 'scheduled',
    });
    setEditingExam(null);
  };

  const openEditModal = (exam: Exam) => {
    setEditingExam(exam);
    setFormData({
      name: exam.name,
      exam_code: exam.exam_code,
      exam_type: exam.exam_type,
      start_date: exam.start_date,
      end_date: exam.end_date,
      semester: String(exam.semester),
      year: exam.year,
      total_marks: exam.total_marks,
      passing_marks: exam.passing_marks,
      description: '',
      status: exam.status,
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const getStatusVariant = (status: string): 'default' | 'success' | 'warning' | 'danger' => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'ongoing':
        return 'warning';
      case 'cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getExamTypeLabel = (type: string) => {
    const option = examTypeOptions.find((opt) => opt.value === type);
    return option?.label || type;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* God Mode Banner */}
      {university && college && (
        <Alert variant="warning">
          <AlertDescription>
            <strong>God Mode Active:</strong> Viewing exams for{' '}
            <strong>{college.name}</strong> at <strong>{university.name}</strong>
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Examinations</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage exam schedules, results, and analytics
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add Exam
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          options={filterStatusOptions}
          value={statusFilter}
          onChange={setStatusFilter}
          className="w-[180px]"
        />
        <Select
          options={filterExamTypeOptions}
          value={examTypeFilter}
          onChange={setExamTypeFilter}
          className="w-[180px]"
        />
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
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-500">No exams found</p>
                </TableCell>
              </TableRow>
            ) : (
              exams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.name}</TableCell>
                  <TableCell>{exam.exam_code}</TableCell>
                  <TableCell>
                    <Badge variant="info">{getExamTypeLabel(exam.exam_type)}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(exam.start_date)} - {formatDate(exam.end_date)}
                  </TableCell>
                  <TableCell>Sem {exam.semester}</TableCell>
                  <TableCell>
                    {exam.total_marks} ({exam.passing_marks} min)
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(exam.status)}>{exam.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(exam)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
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
          <p className="text-sm text-gray-600">
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

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExam ? 'Edit Exam' : 'Add New Exam'}
        description={
          editingExam ? 'Update exam details below' : 'Fill in the exam information below'
        }
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Exam Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="exam_code">Exam Code *</Label>
              <Input
                id="exam_code"
                value={formData.exam_code}
                onChange={(e) => setFormData({ ...formData, exam_code: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Exam Type *"
              options={examTypeOptions}
              value={formData.exam_type}
              onChange={(value) => setFormData({ ...formData, exam_type: value })}
            />
            <Select
              label="Status *"
              options={statusOptions}
              value={formData.status}
              onChange={(value) => setFormData({ ...formData, status: value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Start Date *</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="end_date">End Date *</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Semester *"
              options={semesterOptions}
              value={formData.semester}
              onChange={(value) => setFormData({ ...formData, semester: value })}
            />
            <div>
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
            <div>
              <Label htmlFor="total_marks">Total Marks *</Label>
              <Input
                id="total_marks"
                type="number"
                value={formData.total_marks}
                onChange={(e) =>
                  setFormData({ ...formData, total_marks: parseInt(e.target.value) })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="passing_marks">Passing Marks *</Label>
              <Input
                id="passing_marks"
                type="number"
                value={formData.passing_marks}
                onChange={(e) =>
                  setFormData({ ...formData, passing_marks: parseInt(e.target.value) })
                }
                required
              />
            </div>
          </div>

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingExam ? 'Update Exam' : 'Create Exam'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
