'use client'

import { useState, useEffect } from 'react'
import { useUniversity } from '@/contexts/UniversityContext'
import { useCollege } from '@/contexts/CollegeContext'
import { useDepartments } from '@/hooks/useDepartments'
import { usePermissions } from '@/hooks/usePermissions'
import { DepartmentCard } from '@/components/departments/DepartmentCard'
import { DepartmentFormModal, DepartmentFormData } from '@/components/departments/DepartmentFormModal'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectOption } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, Plus, Building2, Lock } from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { Department, Faculty } from '@/types'

export default function DepartmentsListPage() {
  const { university } = useUniversity()
  const { college } = useCollege()
  const { canCreateDepartment, canEditDepartment, canDeleteDepartment } = usePermissions()
  
  const [search, setSearch] = useState('')
  const [searchDebounced, setSearchDebounced] = useState('')
  const [statusFilter, setStatusFilter] = useState('active')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<Department | null>(null)
  const [facultyOptions, setFacultyOptions] = useState<SelectOption[]>([])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounced(search)
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  // Fetch faculty for HOD selection
  useEffect(() => {
    if (!university || !college) return

    const fetchFaculty = async () => {
      try {
        const response = await apiClient.get<{ data: Faculty[] }>(
          `/admin/universities/${university.id}/colleges/${college.id}/academic-staff`
        )
        setFacultyOptions(
          response.data.map(f => ({
            label: `${f.name} (${f.designation})`,
            value: f.id,
          }))
        )
      } catch (error) {
        console.error('Failed to fetch faculty:', error)
      }
    }
    fetchFaculty()
  }, [university, college])

  if (!university || !college) {
    return <div>Loading...</div>
  }

  const { departments, isLoading, error, refetch } = useDepartments({
    universityId: university.id,
    collegeId: college.id,
    search: searchDebounced,
    status: statusFilter,
  })

  const handleCreate = () => {
    setSelectedDepartment(null)
    setIsModalOpen(true)
  }

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department)
    setIsModalOpen(true)
  }

  const handleDelete = (department: Department) => {
    setDeleteConfirm(department)
  }

  const confirmDelete = async () => {
    if (!deleteConfirm) return

    try {
      await apiClient.delete(
        `/admin/universities/${university.id}/colleges/${college.id}/departments/${deleteConfirm.id}`
      )
      refetch()
      setDeleteConfirm(null)
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete department')
    }
  }

  const handleSubmit = async (data: DepartmentFormData) => {
    if (selectedDepartment) {
      // Update
      await apiClient.put(
        `/admin/universities/${university.id}/colleges/${college.id}/departments/${selectedDepartment.id}`,
        data
      )
    } else {
      // Create
      await apiClient.post(
        `/admin/universities/${university.id}/colleges/${college.id}/departments`,
        data
      )
    }
    refetch()
  }

  const statusOptions: SelectOption[] = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'All Status', value: '' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600 mt-1">
            {college.name} - {departments.length} departments
          </p>
        </div>
        {canCreateDepartment ? (
          <Button onClick={handleCreate} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Department</span>
          </Button>
        ) : (
          <Button disabled className="flex items-center space-x-2 opacity-50 cursor-not-allowed">
            <Lock className="w-4 h-4" />
            <span>No Permission</span>
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search departments by name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            options={statusOptions}
          />
        </div>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="p-6 bg-red-50 border-red-200">
          <p className="text-red-600">{error}</p>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Departments Grid */}
      {!isLoading && departments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((department) => (
            <DepartmentCard
              key={department.id}
              department={department}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && departments.length === 0 && (
        <Card className="p-12 text-center">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No departments found</h3>
          <p className="text-gray-600 mb-4">
            {searchDebounced || statusFilter !== 'active'
              ? 'Try adjusting your filters or search query'
              : 'Get started by creating your first department'}
          </p>
          {!searchDebounced && statusFilter === 'active' && (
            <Button onClick={handleCreate} className="flex items-center space-x-2 mx-auto">
              <Plus className="w-4 h-4" />
              <span>Add First Department</span>
            </Button>
          )}
        </Card>
      )}

      {/* Create/Edit Modal */}
      <DepartmentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        department={selectedDepartment}
        facultyOptions={facultyOptions}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Department</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
