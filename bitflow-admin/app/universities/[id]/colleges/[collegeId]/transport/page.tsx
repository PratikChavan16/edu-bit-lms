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
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, Edit, Trash2, Bus, MapPin, X } from 'lucide-react';

interface Stop {
  name: string;
  arrival_time: string;
  latitude?: number;
  longitude?: number;
}

interface TransportRoute {
  id: string;
  route_name: string;
  route_number: string;
  route_type: string;
  departure_time: string;
  return_time: string;
  distance_km: number;
  fare_amount: number;
  stops: Stop[];
  status: string;
}

interface PaginationMetadata {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

const routeTypeOptions: SelectOption[] = [
  { label: 'Morning', value: 'morning' },
  { label: 'Evening', value: 'evening' },
  { label: 'Both', value: 'both' },
];

const statusOptions: SelectOption[] = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Under Maintenance', value: 'maintenance' },
];

const filterRouteTypeOptions: SelectOption[] = [
  { label: 'All Types', value: 'all' },
  ...routeTypeOptions,
];

const filterStatusOptions: SelectOption[] = [
  { label: 'All Statuses', value: 'all' },
  ...statusOptions,
];

export default function TransportPage() {
  const params = useParams();
  const { university } = useUniversity();
  const { college } = useCollege();

  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<TransportRoute | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [routeTypeFilter, setRouteTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState<PaginationMetadata>({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });

  const [formData, setFormData] = useState({
    route_name: '',
    route_number: '',
    route_type: 'morning',
    departure_time: '',
    return_time: '',
    distance_km: 0,
    fare_amount: 0,
    status: 'active',
  });

  const [stops, setStops] = useState<Stop[]>([
    { name: '', arrival_time: '', latitude: undefined, longitude: undefined },
  ]);

  useEffect(() => {
    if (university && college) {
      fetchRoutes();
    }
  }, [university, college, searchQuery, routeTypeFilter, statusFilter, pagination.current_page]);

  const fetchRoutes = async () => {
    if (!university || !college) return;

    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.current_page.toString(),
        per_page: pagination.per_page.toString(),
      });

      if (searchQuery) queryParams.append('search', searchQuery);
      if (routeTypeFilter !== 'all') queryParams.append('route_type', routeTypeFilter);
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);

      const data = await apiClient.get<ApiResponse<TransportRoute[]>>(
        `/admin/universities/${university.id}/colleges/${college.id}/transport?${queryParams}`
      );

      if (data.success) {
        setRoutes(data.data);
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
      console.error('Error fetching routes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!university || !college) return;

    try {
      const url = editingRoute
        ? `/admin/universities/${university.id}/colleges/${college.id}/transport/${editingRoute.id}`
        : `/admin/universities/${university.id}/colleges/${college.id}/transport`;

      const payload = {
        ...formData,
        stops: stops.filter((stop) => stop.name.trim() !== ''),
      };

      const data = editingRoute
        ? await apiClient.put<ApiResponse<TransportRoute>>(url, payload)
        : await apiClient.post<ApiResponse<TransportRoute>>(url, payload);

      if (data.success) {
        setIsModalOpen(false);
        resetForm();
        fetchRoutes();
      }
    } catch (error) {
      console.error('Error saving route:', error);
    }
  };

  const handleDelete = async (routeId: string) => {
    if (!confirm('Are you sure you want to delete this route?')) return;
    if (!university || !college) return;

    try {
      const data = await apiClient.delete<ApiResponse<void>>(
        `/admin/universities/${university.id}/colleges/${college.id}/transport/${routeId}`
      );

      if (data.success) {
        fetchRoutes();
      }
    } catch (error) {
      console.error('Error deleting route:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      route_name: '',
      route_number: '',
      route_type: 'morning',
      departure_time: '',
      return_time: '',
      distance_km: 0,
      fare_amount: 0,
      status: 'active',
    });
    setStops([{ name: '', arrival_time: '', latitude: undefined, longitude: undefined }]);
    setEditingRoute(null);
  };

  const openEditModal = (route: TransportRoute) => {
    setEditingRoute(route);
    setFormData({
      route_name: route.route_name,
      route_number: route.route_number,
      route_type: route.route_type,
      departure_time: route.departure_time,
      return_time: route.return_time,
      distance_km: route.distance_km,
      fare_amount: route.fare_amount,
      status: route.status,
    });
    setStops(route.stops.length > 0 ? route.stops : [{ name: '', arrival_time: '', latitude: undefined, longitude: undefined }]);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const addStop = () => {
    setStops([...stops, { name: '', arrival_time: '', latitude: undefined, longitude: undefined }]);
  };

  const removeStop = (index: number) => {
    setStops(stops.filter((_, i) => i !== index));
  };

  const updateStop = (index: number, field: keyof Stop, value: string | number) => {
    const newStops = [...stops];
    newStops[index] = { ...newStops[index], [field]: value };
    setStops(newStops);
  };

  const getStatusVariant = (status: string): 'default' | 'success' | 'warning' | 'danger' => {
    switch (status) {
      case 'active':
        return 'success';
      case 'maintenance':
        return 'warning';
      case 'inactive':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getRouteTypeLabel = (type: string) => {
    const option = routeTypeOptions.find((opt) => opt.value === type);
    return option?.label || type;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {university && college && (
        <Alert variant="warning">
          <AlertDescription>
            <strong>God Mode Active:</strong> Managing transport for{' '}
            <strong>{college.name}</strong> at <strong>{university.name}</strong>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transport Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage bus routes, schedules, and transportation
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add Route
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by route name or number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          options={filterRouteTypeOptions}
          value={routeTypeFilter}
          onChange={setRouteTypeFilter}
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
              <TableHead>Route Name</TableHead>
              <TableHead>Number</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Stops</TableHead>
              <TableHead>Distance</TableHead>
              <TableHead>Fare</TableHead>
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
            ) : routes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <Bus className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-500">No routes found</p>
                </TableCell>
              </TableRow>
            ) : (
              routes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell className="font-medium">{route.route_name}</TableCell>
                  <TableCell>{route.route_number}</TableCell>
                  <TableCell>
                    <Badge variant="info">{getRouteTypeLabel(route.route_type)}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="text-sm">{route.stops.length} stops</span>
                    </div>
                  </TableCell>
                  <TableCell>{route.distance_km} km</TableCell>
                  <TableCell>₹{route.fare_amount}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(route.status)}>{route.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(route)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(route.id)}
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
            {pagination.total} routes
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
        title={editingRoute ? 'Edit Route' : 'Add New Route'}
        description={
          editingRoute ? 'Update route details below' : 'Fill in the route information below'
        }
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="route_name">Route Name *</Label>
              <Input
                id="route_name"
                value={formData.route_name}
                onChange={(e) => setFormData({ ...formData, route_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="route_number">Route Number *</Label>
              <Input
                id="route_number"
                value={formData.route_number}
                onChange={(e) => setFormData({ ...formData, route_number: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Route Type *"
              options={routeTypeOptions}
              value={formData.route_type}
              onChange={(value) => setFormData({ ...formData, route_type: value })}
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
              <Label htmlFor="departure_time">Departure Time *</Label>
              <Input
                id="departure_time"
                type="time"
                value={formData.departure_time}
                onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="return_time">Return Time</Label>
              <Input
                id="return_time"
                type="time"
                value={formData.return_time}
                onChange={(e) => setFormData({ ...formData, return_time: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="distance_km">Distance (km) *</Label>
              <Input
                id="distance_km"
                type="number"
                step="0.1"
                min="0"
                value={formData.distance_km}
                onChange={(e) =>
                  setFormData({ ...formData, distance_km: parseFloat(e.target.value) })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="fare_amount">Fare Amount (₹) *</Label>
              <Input
                id="fare_amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.fare_amount}
                onChange={(e) =>
                  setFormData({ ...formData, fare_amount: parseFloat(e.target.value) })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Stops</Label>
              <Button type="button" variant="outline" size="sm" onClick={addStop}>
                <Plus className="mr-1 h-3 w-3" />
                Add Stop
              </Button>
            </div>

            {stops.map((stop, index) => (
              <div key={index} className="flex items-end gap-2 p-3 border rounded-md">
                <div className="flex-1 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Stop name"
                      value={stop.name}
                      onChange={(e) => updateStop(index, 'name', e.target.value)}
                    />
                    <Input
                      type="time"
                      placeholder="Arrival time"
                      value={stop.arrival_time}
                      onChange={(e) => updateStop(index, 'arrival_time', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      step="any"
                      placeholder="Latitude (optional)"
                      value={stop.latitude || ''}
                      onChange={(e) => updateStop(index, 'latitude', parseFloat(e.target.value) || 0)}
                    />
                    <Input
                      type="number"
                      step="any"
                      placeholder="Longitude (optional)"
                      value={stop.longitude || ''}
                      onChange={(e) => updateStop(index, 'longitude', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                {stops.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeStop(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingRoute ? 'Update Route' : 'Add Route'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
