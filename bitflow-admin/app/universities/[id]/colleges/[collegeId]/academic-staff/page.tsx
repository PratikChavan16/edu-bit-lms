'use client'

import { use, useState, useEffect } from 'react'
import { useUniversity } from '@/contexts/UniversityContext'
import { useCollege } from '@/contexts/CollegeContext'
import { useFaculty } from '@/hooks/useFaculty'
import { usePermissions } from '@/hooks/usePermissions'
import { useToast } from '@/components/ui/toast'
import { handleError, confirmAction, SUCCESS_MESSAGES } from '@/lib/errorHandler'
import { FacultyCard } from '@/components/faculty/FacultyCard'
import FacultyFormModal from '@/components/faculty/FacultyFormModal'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectOption } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, Plus, GraduationCap, Lock } from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { Department } from '@/types'

export default function AcademicStaffListPage({
  params,
}: {
  params: Promise<{ id: string; collegeId: string }>
}) {
  const { id, collegeId } = use(params)
  const { university } = useUniversity()
  const { college } = useCollege()
  const { canCreateFaculty } = usePermissions()
  const toast = useToast()
  
  const [search, setSearch] = useState('')
  const [searchDebounced, setSearchDebounced] = useState('')
  const [filters, setFilters] = useState({
    department: '',
    designation: '',
  })
  const [departments, setDepartments] = useState<Department[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFaculty, setSelectedFaculty] = useState<any>(null)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounced(search)
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  // Fetch departments for filter
  useEffect(() => {
    if (!university || !college) return
    
    const fetchDepartments = async () => {
      try {
        const response = await apiClient.get<{ data: Department[] }>(
          `/admin/universities/${id}/colleges/${collegeId}/departments`
        )
        setDepartments(response.data)
      } catch (error: any) {
        // Silently handle 404 - departments might not exist yet
        if (error.response?.status === 404) {
          setDepartments([])
        } else {
          // Only show error for non-404 errors
          handleError(error, toast, { 
            customMessage: 'Failed to fetch departments',
            logError: true,
            showToast: false // Don't spam user with error toast
          })
        }
      }
    }
    fetchDepartments()
  }, [id, collegeId])

  const { faculty, isLoading, error, refetch } = useFaculty({
    universityId: id,
    collegeId: collegeId,
    search: searchDebounced,
    department: filters.department,
    designation: filters.designation,
  })

  const handleAddFaculty = () => {
    setSelectedFaculty(null)
    setIsModalOpen(true)
  }

  const handleEditFaculty = (facultyMember: any) => {
    setSelectedFaculty(facultyMember)
    setIsModalOpen(true)
  }

  const handleDeleteFaculty = async (facultyId: string) => {
    const confirmed = await confirmAction({
      message: 'Are you sure you want to delete this faculty member? This action cannot be undone.',
      danger: true
    })
    
    if (!confirmed) return

    try {
      await apiClient.delete(
        `/admin/universities/${id}/colleges/${collegeId}/academic-staff/${facultyId}`
      )
      toast.success(SUCCESS_MESSAGES.FACULTY_DELETED)
      refetch()
    } catch (err) {
      handleError(err, toast, { customMessage: 'Failed to delete faculty member' })
    }
  }

  const handleModalSuccess = () => {
    refetch()
  }

  if (!university || !college) {
    return <div>Loading...</div>
  }

  const departmentOptions: SelectOption[] = [
    { label: 'All Departments', value: '' },
    ...departments.map((dept: any) => ({
      label: dept.name,
      value: dept.id,
    })),
  ]

  const designationOptions: SelectOption[] = [
    { label: 'All Designations', value: '' },
    { label: 'Professor', value: 'Professor' },
    { label: 'Associate Professor', value: 'Associate Professor' },
    { label: 'Assistant Professor', value: 'Assistant Professor' },
    { label: 'Lecturer', value: 'Lecturer' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academic Staff</h1>
          <p className="text-gray-600 mt-1">
            {college.name} - {faculty.length} faculty members
          </p>
        </div>
        {canCreateFaculty ? (
          <Button onClick={handleAddFaculty} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Faculty</span>
          </Button>
        ) : (
          <Button disabled className="flex items-center space-x-2 opacity-50 cursor-not-allowed">
            <Plus className="w-4 h-4" />
            <span>No Permission to Add Faculty</span>
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name, employee ID, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select
            value={filters.department}
            onChange={(value) => setFilters({ ...filters, department: value })}
            options={departmentOptions}
          />
          
          <Select
            value={filters.designation}
            onChange={(value) => setFilters({ ...filters, designation: value })}
            options={designationOptions}
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

      {/* Faculty Grid */}
      {!isLoading && faculty.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faculty.map((member) => (
            <FacultyCard
              key={member.id}
              faculty={member}
              onEdit={() => handleEditFaculty(member)}
              onDelete={() => handleDeleteFaculty(member.id)}
            />
          ))}
        </div>
      )}

      {/* Faculty Form Modal */}
      <FacultyFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        faculty={selectedFaculty}
        universityId={id}
        collegeId={collegeId}
      />

      {/* Empty State */}
      {!isLoading && faculty.length === 0 && (
        <Card className="p-12 text-center">
          <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No faculty found</h3>
          <p className="text-gray-600 mb-4">
            {searchDebounced || filters.department || filters.designation
              ? 'Try adjusting your filters or search query'
              : 'Get started by adding your first faculty member'}
          </p>
          {!searchDebounced && !filters.department && !filters.designation && (
            <Button className="flex items-center space-x-2 mx-auto">
              <Plus className="w-4 h-4" />
              <span>Add First Faculty</span>
            </Button>
          )}
        </Card>
      )}
    </div>
  )
}
