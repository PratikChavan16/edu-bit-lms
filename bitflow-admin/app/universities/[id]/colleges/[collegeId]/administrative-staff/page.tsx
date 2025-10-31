'use client'

import { use, useState, useEffect } from 'react'
import { useCollege } from '@/contexts/CollegeContext'
import { useUniversity } from '@/contexts/UniversityContext'
import { usePermissions } from '@/hooks/usePermissions'
import { useToast } from '@/components/ui/toast'
import { handleError, confirmAction, SUCCESS_MESSAGES } from '@/lib/errorHandler'
import { apiClient } from '@/lib/api-client'
import Breadcrumb from '@/components/Breadcrumb'
import { AdministrativeStaffCard } from '@/components/administrative-staff/AdministrativeStaffCard'
import AdministrativeStaffFormModal from '@/components/administrative-staff/AdministrativeStaffFormModal'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectOption } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { AlertCircle, UserCog, Plus, Search, Lock, Users } from 'lucide-react'

interface AdministrativeStaff {
  id: string
  first_name: string
  last_name: string
  full_name?: string
  email: string
  phone?: string
  role: string
  employee_id?: string
  designation?: string
  department_name?: string
  joining_date?: string
  status: 'active' | 'inactive' | 'on_leave'
}

export default function AdministrativeStaffPage({
  params,
}: {
  params: Promise<{ id: string; collegeId: string }>
}) {
  const { id, collegeId } = use(params)
  const { university } = useUniversity()
  const { college, loading, error } = useCollege()
  const { canManageUsers } = usePermissions()
  const toast = useToast()

  const [staff, setStaff] = useState<AdministrativeStaff[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<AdministrativeStaff | null>(null)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('active')

  useEffect(() => {
    fetchAdministrativeStaff()
  }, [id, collegeId, search, roleFilter, statusFilter])

  const fetchAdministrativeStaff = async () => {
    setIsLoading(true)
    try {
      const queryParams = new URLSearchParams()
      if (search) queryParams.append('search', search)
      if (roleFilter !== 'all') queryParams.append('role', roleFilter)
      if (statusFilter !== 'all') queryParams.append('status', statusFilter)

      const response = await apiClient.get<{ data: AdministrativeStaff[] }>(
        `/admin/universities/${id}/colleges/${collegeId}/administrative-staff?${queryParams}`
      )

      setStaff(response.data || [])
    } catch (error: any) {
      // If endpoint doesn't exist yet, show empty state
      if (error.response?.status === 404) {
        setStaff([])
      } else {
        handleError(error, toast, { customMessage: 'Failed to fetch administrative staff' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddStaff = () => {
    setSelectedStaff(null)
    setIsModalOpen(true)
  }

  const handleEditStaff = (staffMember: AdministrativeStaff) => {
    setSelectedStaff(staffMember)
    setIsModalOpen(true)
  }

  const handleDeleteStaff = async (staffId: string) => {
    const confirmed = await confirmAction({
      message: 'Are you sure you want to delete this staff member? This action cannot be undone.',
      danger: true
    })

    if (!confirmed) return

    try {
      await apiClient.delete(
        `/admin/universities/${id}/colleges/${collegeId}/administrative-staff/${staffId}`
      )
      toast.success(SUCCESS_MESSAGES.ADMIN_STAFF_DELETED)
      fetchAdministrativeStaff()
    } catch (error: any) {
      handleError(error, toast, { customMessage: 'Failed to delete staff member' })
    }
  }

  const handleModalSuccess = () => {
    fetchAdministrativeStaff()
  }

  const roleOptions: SelectOption[] = [
    { label: 'All Roles', value: 'all' },
    { label: 'Admission Officers', value: 'admission_admin' },
    { label: 'Accounts Administrators', value: 'college_accounts_admin' },
    { label: 'Fee Collection Administrators', value: 'college_fee_admin' },
  ]

  const statusOptions: SelectOption[] = [
    { label: 'All Status', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'On Leave', value: 'on_leave' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !college) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Error Loading College
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{error || 'College not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb
        items={[
          { label: 'Universities', href: '/universities' },
          { label: university?.name || 'University', href: `/universities/${id}` },
          { label: 'Colleges', href: `/universities/${id}/colleges` },
          { label: college.name, href: `/universities/${id}/colleges/${collegeId}` },
          { label: 'Administrative Staff', current: true },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <UserCog className="w-8 h-8 text-orange-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Administrative Staff</h1>
              <p className="text-gray-600 mt-1">
                {college.name} - {staff.length} staff members
              </p>
            </div>
          </div>
        </div>

        {canManageUsers ? (
          <Button onClick={handleAddStaff} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Staff Member</span>
          </Button>
        ) : (
          <Button disabled className="flex items-center space-x-2 opacity-50 cursor-not-allowed">
            <Plus className="w-4 h-4" />
            <span>No Permission to Add Staff</span>
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, email, or employee ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div>
            <Select
              options={roleOptions}
              value={roleFilter}
              onChange={setRoleFilter}
              placeholder="Filter by role"
            />
          </div>

          <div>
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Filter by status"
            />
          </div>
        </div>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Staff Grid */}
      {!isLoading && staff.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map((staffMember) => (
            <AdministrativeStaffCard
              key={staffMember.id}
              staff={staffMember}
              onEdit={canManageUsers ? () => handleEditStaff(staffMember) : undefined}
              onDelete={canManageUsers ? () => handleDeleteStaff(staffMember.id) : undefined}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && staff.length === 0 && (
        <Card className="p-12 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No administrative staff found</h3>
          <p className="text-gray-600 mb-4">
            {search || roleFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your filters or search query'
              : 'Get started by adding your first administrative staff member'}
          </p>
          {!search && roleFilter === 'all' && statusFilter === 'all' && canManageUsers && (
            <Button onClick={handleAddStaff} className="flex items-center space-x-2 mx-auto">
              <Plus className="w-4 h-4" />
              <span>Add First Staff Member</span>
            </Button>
          )}
        </Card>
      )}

      {/* Administrative Staff Form Modal */}
      <AdministrativeStaffFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        staff={selectedStaff}
        universityId={id}
        collegeId={collegeId}
      />
    </div>
  )
}
