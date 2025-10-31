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
import { Plus, Search, Edit, Trash2, Home } from 'lucide-react';

interface Hostel {
  id: string;
  name: string;
  hostel_code: string;
  hostel_type: string;
  warden_name: string;
  warden_contact: string;
  capacity: number;
  occupied_beds: number;
  available_beds: number;
  monthly_fee: number;
  security_deposit: number;
  facilities: string[];
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  status: string;
}

interface PaginationMetadata {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

const hostelTypeOptions: SelectOption[] = [
  { label: 'Boys', value: 'boys' },
  { label: 'Girls', value: 'girls' },
  { label: 'Co-ed', value: 'coed' },
];

const statusOptions: SelectOption[] = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Under Renovation', value: 'renovation' },
];

const filterHostelTypeOptions: SelectOption[] = [
  { label: 'All Types', value: 'all' },
  ...hostelTypeOptions,
];

const filterStatusOptions: SelectOption[] = [
  { label: 'All Statuses', value: 'all' },
  ...statusOptions,
];

const facilityOptions = [
  { id: 'wifi', label: 'WiFi' },
  { id: 'mess', label: 'Mess/Canteen' },
  { id: 'laundry', label: 'Laundry' },
  { id: 'gym', label: 'Gym' },
  { id: 'library', label: 'Library' },
  { id: 'common_room', label: 'Common Room' },
  { id: 'sports', label: 'Sports Facilities' },
  { id: 'parking', label: 'Parking' },
];

export default function HostelPage() {
  const params = useParams();
  const { university } = useUniversity();
  const { college } = useCollege();

  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHostel, setEditingHostel] = useState<Hostel | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hostelTypeFilter, setHostelTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState<PaginationMetadata>({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });

  const [formData, setFormData] = useState({
    name: '',
    hostel_code: '',
    hostel_type: 'boys',
    warden_name: '',
    warden_contact: '',
    warden_email: '',
    capacity: 0,
    monthly_fee: 0,
    security_deposit: 0,
    street: '',
    city: '',
    state: '',
    pincode: '',
    description: '',
    status: 'active',
  });

  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);

  useEffect(() => {
    if (university && college) {
      fetchHostels();
    }
  }, [university, college, searchQuery, hostelTypeFilter, statusFilter, pagination.current_page]);

  const fetchHostels = async () => {
    if (!university || !college) return;

    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.current_page.toString(),
        per_page: pagination.per_page.toString(),
      });

      if (searchQuery) queryParams.append('search', searchQuery);
      if (hostelTypeFilter !== 'all') queryParams.append('hostel_type', hostelTypeFilter);
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);

      const data = await apiClient.get<ApiResponse<Hostel[]>>(
        `/admin/universities/${university.id}/colleges/${college.id}/hostel?${queryParams}`
      );

      if (data.success) {
        setHostels(data.data);
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
      console.error('Error fetching hostels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!university || !college) return;

    try {
      const url = editingHostel
        ? `/admin/universities/${university.id}/colleges/${college.id}/hostel/${editingHostel.id}`
        : `/admin/universities/${university.id}/colleges/${college.id}/hostel`;

      const payload = {
        ...formData,
        facilities: selectedFacilities,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
      };

      const data = editingHostel
        ? await apiClient.put<ApiResponse<Hostel>>(url, payload)
        : await apiClient.post<ApiResponse<Hostel>>(url, payload);

      if (data.success) {
        setIsModalOpen(false);
        resetForm();
        fetchHostels();
      }
    } catch (error) {
      console.error('Error saving hostel:', error);
    }
  };

  const handleDelete = async (hostelId: string) => {
    if (!confirm('Are you sure you want to delete this hostel?')) return;
    if (!university || !college) return;

    try {
      const data = await apiClient.delete<ApiResponse<void>>(
        `/admin/universities/${university.id}/colleges/${college.id}/hostel/${hostelId}`
      );

      if (data.success) {
        fetchHostels();
      }
    } catch (error) {
      console.error('Error deleting hostel:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      hostel_code: '',
      hostel_type: 'boys',
      warden_name: '',
      warden_contact: '',
      warden_email: '',
      capacity: 0,
      monthly_fee: 0,
      security_deposit: 0,
      street: '',
      city: '',
      state: '',
      pincode: '',
      description: '',
      status: 'active',
    });
    setSelectedFacilities([]);
    setEditingHostel(null);
  };

  const openEditModal = (hostel: Hostel) => {
    setEditingHostel(hostel);
    setFormData({
      name: hostel.name,
      hostel_code: hostel.hostel_code,
      hostel_type: hostel.hostel_type,
      warden_name: hostel.warden_name,
      warden_contact: hostel.warden_contact,
      warden_email: '',
      capacity: hostel.capacity,
      monthly_fee: hostel.monthly_fee,
      security_deposit: hostel.security_deposit,
      street: hostel.address?.street || '',
      city: hostel.address?.city || '',
      state: hostel.address?.state || '',
      pincode: hostel.address?.pincode || '',
      description: '',
      status: hostel.status,
    });
    setSelectedFacilities(hostel.facilities || []);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const toggleFacility = (facilityId: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facilityId)
        ? prev.filter((id) => id !== facilityId)
        : [...prev, facilityId]
    );
  };

  const getStatusVariant = (status: string): 'default' | 'success' | 'warning' | 'danger' => {
    switch (status) {
      case 'active':
        return 'success';
      case 'renovation':
        return 'warning';
      case 'inactive':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getHostelTypeLabel = (type: string) => {
    const option = hostelTypeOptions.find((opt) => opt.value === type);
    return option?.label || type;
  };

  const getOccupancyColor = (occupiedBeds: number, capacity: number) => {
    const percentage = (occupiedBeds / capacity) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {university && college && (
        <Alert variant="warning">
          <AlertDescription>
            <strong>God Mode Active:</strong> Managing hostels for{' '}
            <strong>{college.name}</strong> at <strong>{university.name}</strong>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hostel Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage hostel accommodations, rooms, and facilities
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add Hostel
        </Button>
      </div>

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
          options={filterHostelTypeOptions}
          value={hostelTypeFilter}
          onChange={setHostelTypeFilter}
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
              <TableHead>Hostel Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Warden</TableHead>
              <TableHead>Occupancy</TableHead>
              <TableHead>Fee</TableHead>
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
            ) : hostels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <Home className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-500">No hostels found</p>
                </TableCell>
              </TableRow>
            ) : (
              hostels.map((hostel) => (
                <TableRow key={hostel.id}>
                  <TableCell className="font-medium">{hostel.name}</TableCell>
                  <TableCell>{hostel.hostel_code}</TableCell>
                  <TableCell>
                    <Badge variant="info">{getHostelTypeLabel(hostel.hostel_type)}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{hostel.warden_name}</div>
                      <div className="text-gray-500">{hostel.warden_contact}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className={`font-medium ${getOccupancyColor(hostel.occupied_beds, hostel.capacity)}`}>
                        {hostel.occupied_beds}/{hostel.capacity}
                      </div>
                      <div className="text-gray-500">{hostel.available_beds} available</div>
                    </div>
                  </TableCell>
                  <TableCell>₹{hostel.monthly_fee}/month</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(hostel.status)}>{hostel.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(hostel)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(hostel.id)}
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
            {pagination.total} hostels
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
        title={editingHostel ? 'Edit Hostel' : 'Add New Hostel'}
        description={
          editingHostel ? 'Update hostel details below' : 'Fill in the hostel information below'
        }
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Hostel Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="hostel_code">Hostel Code *</Label>
              <Input
                id="hostel_code"
                value={formData.hostel_code}
                onChange={(e) => setFormData({ ...formData, hostel_code: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Hostel Type *"
              options={hostelTypeOptions}
              value={formData.hostel_type}
              onChange={(value) => setFormData({ ...formData, hostel_type: value })}
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
              <Label htmlFor="warden_name">Warden Name *</Label>
              <Input
                id="warden_name"
                value={formData.warden_name}
                onChange={(e) => setFormData({ ...formData, warden_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="warden_contact">Warden Contact *</Label>
              <Input
                id="warden_contact"
                value={formData.warden_contact}
                onChange={(e) => setFormData({ ...formData, warden_contact: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="warden_email">Warden Email</Label>
            <Input
              id="warden_email"
              type="email"
              value={formData.warden_email}
              onChange={(e) => setFormData({ ...formData, warden_email: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="capacity">Capacity *</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: parseInt(e.target.value) })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="monthly_fee">Monthly Fee (₹) *</Label>
              <Input
                id="monthly_fee"
                type="number"
                min="0"
                step="0.01"
                value={formData.monthly_fee}
                onChange={(e) =>
                  setFormData({ ...formData, monthly_fee: parseFloat(e.target.value) })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="security_deposit">Security Deposit (₹)</Label>
              <Input
                id="security_deposit"
                type="number"
                min="0"
                step="0.01"
                value={formData.security_deposit}
                onChange={(e) =>
                  setFormData({ ...formData, security_deposit: parseFloat(e.target.value) })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Facilities</Label>
            <div className="grid grid-cols-2 gap-2">
              {facilityOptions.map((facility) => (
                <label
                  key={facility.id}
                  className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <input
                    type="checkbox"
                    checked={selectedFacilities.includes(facility.id)}
                    onChange={() => toggleFacility(facility.id)}
                    className="rounded"
                  />
                  <span className="text-sm">{facility.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Address</Label>
            <div className="space-y-2">
              <Input
                placeholder="Street Address"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              />
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
                <Input
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
                <Input
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                />
              </div>
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
            <Button type="submit">{editingHostel ? 'Update Hostel' : 'Add Hostel'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
