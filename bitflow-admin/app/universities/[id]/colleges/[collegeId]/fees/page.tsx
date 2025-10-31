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
import { Plus, Search, Edit, Trash2, DollarSign, Calendar } from 'lucide-react';

interface FeeStructure {
  id: string;
  name: string;
  fee_code: string;
  fee_type: string;
  amount: number;
  academic_year: string;
  semester: number;
  year: number;
  due_date: string;
  late_fee_amount: number;
  late_fee_type: string;
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

const feeTypeOptions: SelectOption[] = [
  { label: 'Tuition Fee', value: 'tuition' },
  { label: 'Admission Fee', value: 'admission' },
  { label: 'Exam Fee', value: 'exam' },
  { label: 'Library Fee', value: 'library' },
  { label: 'Lab Fee', value: 'lab' },
  { label: 'Sports Fee', value: 'sports' },
  { label: 'Transport Fee', value: 'transport' },
  { label: 'Hostel Fee', value: 'hostel' },
  { label: 'Other', value: 'other' },
];

const lateFeeTypeOptions: SelectOption[] = [
  { label: 'Flat Amount', value: 'flat' },
  { label: 'Percentage', value: 'percentage' },
];

const statusOptions: SelectOption[] = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Archived', value: 'archived' },
];

const semesterOptions: SelectOption[] = Array.from({ length: 8 }, (_, i) => ({
  label: `Semester ${i + 1}`,
  value: String(i + 1),
}));

const yearOptions: SelectOption[] = [
  { label: '1st Year', value: '1' },
  { label: '2nd Year', value: '2' },
  { label: '3rd Year', value: '3' },
  { label: '4th Year', value: '4' },
];

const filterFeeTypeOptions: SelectOption[] = [
  { label: 'All Types', value: 'all' },
  ...feeTypeOptions,
];

const filterStatusOptions: SelectOption[] = [
  { label: 'All Statuses', value: 'all' },
  ...statusOptions,
];

export default function FeesPage() {
  const params = useParams();
  const { university } = useUniversity();
  const { college } = useCollege();

  const [fees, setFees] = useState<FeeStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<FeeStructure | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [feeTypeFilter, setFeeTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [academicYearFilter, setAcademicYearFilter] = useState('all');
  const [pagination, setPagination] = useState<PaginationMetadata>({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });

  const [formData, setFormData] = useState({
    name: '',
    fee_code: '',
    fee_type: 'tuition',
    amount: 0,
    academic_year: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
    semester: '1',
    year: '1',
    due_date: '',
    late_fee_amount: 0,
    late_fee_type: 'flat',
    grace_period_days: 0,
    description: '',
    status: 'active',
  });

  useEffect(() => {
    if (university && college) {
      fetchFees();
    }
  }, [university, college, searchQuery, feeTypeFilter, statusFilter, academicYearFilter, pagination.current_page]);

  const fetchFees = async () => {
    if (!university || !college) return;

    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.current_page.toString(),
        per_page: pagination.per_page.toString(),
      });

      if (searchQuery) queryParams.append('search', searchQuery);
      if (feeTypeFilter !== 'all') queryParams.append('fee_type', feeTypeFilter);
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);
      if (academicYearFilter !== 'all') queryParams.append('academic_year', academicYearFilter);

      const data = await apiClient.get<ApiResponse<FeeStructure[]>>(
        `/admin/universities/${university.id}/colleges/${college.id}/fees?${queryParams}`
      );

      if (data.success) {
        setFees(data.data);
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
      console.error('Error fetching fees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!university || !college) return;

    try {
      const url = editingFee
        ? `/admin/universities/${university.id}/colleges/${college.id}/fees/${editingFee.id}`
        : `/admin/universities/${university.id}/colleges/${college.id}/fees`;

      const payload = {
        ...formData,
        semester: parseInt(formData.semester),
        year: parseInt(formData.year),
      };

      const data = editingFee
        ? await apiClient.put<ApiResponse<FeeStructure>>(url, payload)
        : await apiClient.post<ApiResponse<FeeStructure>>(url, payload);

      if (data.success) {
        setIsModalOpen(false);
        resetForm();
        fetchFees();
      }
    } catch (error) {
      console.error('Error saving fee:', error);
    }
  };

  const handleDelete = async (feeId: string) => {
    if (!confirm('Are you sure you want to delete this fee structure?')) return;
    if (!university || !college) return;

    try {
      const data = await apiClient.delete<ApiResponse<void>>(
        `/admin/universities/${university.id}/colleges/${college.id}/fees/${feeId}`
      );

      if (data.success) {
        fetchFees();
      }
    } catch (error) {
      console.error('Error deleting fee:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      fee_code: '',
      fee_type: 'tuition',
      amount: 0,
      academic_year: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      semester: '1',
      year: '1',
      due_date: '',
      late_fee_amount: 0,
      late_fee_type: 'flat',
      grace_period_days: 0,
      description: '',
      status: 'active',
    });
    setEditingFee(null);
  };

  const openEditModal = (fee: FeeStructure) => {
    setEditingFee(fee);
    setFormData({
      name: fee.name,
      fee_code: fee.fee_code,
      fee_type: fee.fee_type,
      amount: fee.amount,
      academic_year: fee.academic_year,
      semester: String(fee.semester),
      year: String(fee.year),
      due_date: fee.due_date,
      late_fee_amount: fee.late_fee_amount,
      late_fee_type: fee.late_fee_type,
      grace_period_days: 0,
      description: '',
      status: fee.status,
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const getStatusVariant = (status: string): 'default' | 'success' | 'warning' | 'danger' => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'archived':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getFeeTypeLabel = (type: string) => {
    const option = feeTypeOptions.find((opt) => opt.value === type);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Generate academic year options
  const currentYear = new Date().getFullYear();
  const academicYearOptions: SelectOption[] = [
    { label: 'All Years', value: 'all' },
    { label: `${currentYear - 2}-${currentYear - 1}`, value: `${currentYear - 2}-${currentYear - 1}` },
    { label: `${currentYear - 1}-${currentYear}`, value: `${currentYear - 1}-${currentYear}` },
    { label: `${currentYear}-${currentYear + 1}`, value: `${currentYear}-${currentYear + 1}` },
    { label: `${currentYear + 1}-${currentYear + 2}`, value: `${currentYear + 1}-${currentYear + 2}` },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      {university && college && (
        <Alert variant="warning">
          <AlertDescription>
            <strong>God Mode Active:</strong> Managing fees for{' '}
            <strong>{college.name}</strong> at <strong>{university.name}</strong>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fee Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage fee structures, payments, and financial records
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add Fee
        </Button>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
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
          options={filterFeeTypeOptions}
          value={feeTypeFilter}
          onChange={setFeeTypeFilter}
          className="w-[180px]"
        />
        <Select
          options={academicYearOptions}
          value={academicYearFilter}
          onChange={setAcademicYearFilter}
          className="w-[180px]"
        />
        <Select
          options={filterStatusOptions}
          value={statusFilter}
          onChange={setStatusFilter}
          className="w-[180px]"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fee Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Academic Year</TableHead>
              <TableHead>Due Date</TableHead>
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
            ) : fees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <DollarSign className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-500">No fee structures found</p>
                </TableCell>
              </TableRow>
            ) : (
              fees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell className="font-medium">{fee.name}</TableCell>
                  <TableCell>{fee.fee_code}</TableCell>
                  <TableCell>
                    <Badge variant="info">{getFeeTypeLabel(fee.fee_type)}</Badge>
                  </TableCell>
                  <TableCell className="font-semibold">{formatCurrency(fee.amount)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      {fee.academic_year}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(fee.due_date)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(fee.status)}>{fee.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(fee)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(fee.id)}
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

      {pagination.last_page > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {(pagination.current_page - 1) * pagination.per_page + 1} to{' '}
            {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of{' '}
            {pagination.total} fee structures
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFee ? 'Edit Fee Structure' : 'Add New Fee Structure'}
        description={
          editingFee ? 'Update fee details below' : 'Fill in the fee information below'
        }
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Fee Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="fee_code">Fee Code *</Label>
              <Input
                id="fee_code"
                value={formData.fee_code}
                onChange={(e) => setFormData({ ...formData, fee_code: e.target.value })}
                placeholder="FEE-2024-001"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Fee Type *"
              options={feeTypeOptions}
              value={formData.fee_type}
              onChange={(value) => setFormData({ ...formData, fee_type: value })}
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
              <Label htmlFor="amount">Amount (₹) *</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: parseFloat(e.target.value) })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="academic_year">Academic Year *</Label>
              <Input
                id="academic_year"
                value={formData.academic_year}
                onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                placeholder="2024-2025"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Select
              label="Semester *"
              options={semesterOptions}
              value={formData.semester}
              onChange={(value) => setFormData({ ...formData, semester: value })}
            />
            <Select
              label="Year *"
              options={yearOptions}
              value={formData.year}
              onChange={(value) => setFormData({ ...formData, year: value })}
            />
            <div>
              <Label htmlFor="due_date">Due Date *</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Select
              label="Late Fee Type"
              options={lateFeeTypeOptions}
              value={formData.late_fee_type}
              onChange={(value) => setFormData({ ...formData, late_fee_type: value })}
            />
            <div>
              <Label htmlFor="late_fee_amount">
                Late Fee {formData.late_fee_type === 'percentage' ? '(%)' : '(₹)'}
              </Label>
              <Input
                id="late_fee_amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.late_fee_amount}
                onChange={(e) =>
                  setFormData({ ...formData, late_fee_amount: parseFloat(e.target.value) })
                }
              />
            </div>
            <div>
              <Label htmlFor="grace_period_days">Grace Period (days)</Label>
              <Input
                id="grace_period_days"
                type="number"
                min="0"
                value={formData.grace_period_days}
                onChange={(e) =>
                  setFormData({ ...formData, grace_period_days: parseInt(e.target.value) })
                }
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
            <Button type="submit">{editingFee ? 'Update Fee' : 'Add Fee'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
