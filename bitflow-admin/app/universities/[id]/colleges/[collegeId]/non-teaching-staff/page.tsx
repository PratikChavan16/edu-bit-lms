'use client'

import { use, useState, useEffect } from 'react'
import { useCollege } from '@/contexts/CollegeContext'
import { useUniversity } from '@/contexts/UniversityContext'
import { usePermissions } from '@/hooks/usePermissions'
import { useToast } from '@/components/ui/toast'
import { handleError, confirmAction, SUCCESS_MESSAGES } from '@/lib/errorHandler'
import Breadcrumb from '@/components/Breadcrumb'
import NonTeachingStaffCard from '@/components/non-teaching-staff/NonTeachingStaffCard'
import NonTeachingStaffFormModal from '@/components/non-teaching-staff/NonTeachingStaffFormModal'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectOption } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { apiClient } from '@/lib/api-client'
import { AlertCircle, Wrench, Plus, Search, Lock } from 'lucide-react'

interface NonTeachingStaff {
  id: string
  first_name: string
  last_name: string
  full_name: string
  email?: string
  phone?: string
  employee_id: string
  designation: string
  employee_type: 'lab_assistant' | 'peon' | 'maintenance' | 'security' | 'clerical' | 'other'
  department_name?: string
  joining_date?: string
  shift?: 'morning' | 'evening' | 'night' | 'rotational'
  supervisor_name?: string
  status: 'active' | 'inactive' | 'on_leave'
}

export default function NonTeachingStaffPage({
  params,
}: {
  params: Promise<{ id: string; collegeId: string }>
}) {
  const { id, collegeId } = use(params)
  const { university } = useUniversity()
  const { college, loading, error } = useCollege()
  const { canManageUsers } = usePermissions()
  const toast = useToast()

  const [staff, setStaff] = useState<NonTeachingStaff[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<NonTeachingStaff | null>(null)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('active')

  useEffect(() => {
    if (university && college) {
      fetchNonTeachingStaff()
    }
  }, [university, college, search, typeFilter, statusFilter])

  const fetchNonTeachingStaff = async () => {
    try {
      setIsLoading(true)
      const queryParams = new URLSearchParams()
      if (search) queryParams.append('search', search)
      if (typeFilter !== 'all') queryParams.append('employee_type', typeFilter)
      if (statusFilter !== 'all') queryParams.append('status', statusFilter)

      const response = await apiClient.get<{ data: NonTeachingStaff[] }>(
        `/admin/universities/${university?.id}/colleges/${college?.id}/non-teaching-staff?${queryParams}`
      )
      setStaff(response.data || [])
    } catch (error) {
      handleError(error, toast, { customMessage: 'Failed to fetch non-teaching staff' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddStaff = () => {
    setSelectedStaff(null)
    setIsModalOpen(true)
  }

  const handleEditStaff = (staffMember: NonTeachingStaff) => {
    setSelectedStaff(staffMember)
    setIsModalOpen(true)
  }

  const handleDeleteStaff = async (staffId: string) => {
    const confirmed = await confirmAction({
      message: 'Are you sure you want to remove this staff member? This action cannot be undone.',
      danger: true
    })

    if (!confirmed) return

    try {
      await apiClient.delete(
        `/admin/universities/${university?.id}/colleges/${college?.id}/non-teaching-staff/${staffId}`
      )
      toast.success(SUCCESS_MESSAGES.NON_TEACHING_STAFF_DELETED)
      await fetchNonTeachingStaff()
    } catch (error) {
      handleError(error, toast, { customMessage: 'Failed to delete staff member' })
    }
  }

  const handleModalSuccess = () => {
    fetchNonTeachingStaff()
  }

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

  const typeOptions: SelectOption[] = [
    { label: 'All Types', value: 'all' },
    { label: 'Lab Assistant', value: 'lab_assistant' },
    { label: 'Peon', value: 'peon' },
    { label: 'Maintenance', value: 'maintenance' },
    { label: 'Security', value: 'security' },
    { label: 'Clerical', value: 'clerical' },
    { label: 'Other', value: 'other' },
  ]

  const statusOptions: SelectOption[] = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'On Leave', value: 'on_leave' },
  ]

  return (
    <div className="p-6">
      <Breadcrumb
        items={[
          { label: 'Universities', href: '/universities' },
          { label: university?.name || 'University', href: `/universities/${id}` },
          { label: 'Colleges', href: `/universities/${id}/colleges` },
          { label: college.name, href: `/universities/${id}/colleges/${collegeId}` },
          { label: 'Non-Teaching Staff', current: true },
        ]}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Wrench className="w-10 h-10 text-teal-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Non-Teaching Staff
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {staff.length} staff member{staff.length !== 1 ? 's' : ''} • {college.name}
              </p>
            </div>
          </div>

          {canManageUsers && (
            <Button onClick={handleAddStaff} className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Staff Member</span>
            </Button>
          )}
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search by name, email, employee ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select
                options={typeOptions}
                value={typeFilter}
                onChange={(value) => setTypeFilter(value as string)}
              />

              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={(value) => setStatusFilter(value as string)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 dark:bg-gray-700 rounded-lg h-64 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Staff Grid */}
        {!isLoading && staff.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staff.map((staffMember) => (
              <NonTeachingStaffCard
                key={staffMember.id}
                staff={staffMember}
                onEdit={canManageUsers ? handleEditStaff : undefined}
                onDelete={canManageUsers ? handleDeleteStaff : undefined}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && staff.length === 0 && (
          <div className="text-center py-12">
            {!canManageUsers ? (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-8 max-w-md mx-auto">
                <Lock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Permission
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  You don't have permission to manage non-teaching staff.
                </p>
              </div>
            ) : (
              <div>
                <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Non-Teaching Staff Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Get started by adding your first staff member.
                </p>
                <Button onClick={handleAddStaff}>
                  <Plus className="w-5 h-5 mr-2" />
                  Add First Staff Member
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Staff Form Modal */}
      <NonTeachingStaffFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        staff={selectedStaff}
        universityId={university?.id || ''}
        collegeId={college.id}
      />
    </div>
  )
}
