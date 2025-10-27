'use client'

import { useState, useEffect } from 'react'
import { useUniversity } from '@/contexts/UniversityContext'
import { useCollege } from '@/contexts/CollegeContext'
import { useStudents } from '@/hooks/useStudents'
import { usePermissions } from '@/hooks/usePermissions'
import { StudentCard } from '@/components/students/StudentCard'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectOption } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, Plus, Upload, Filter, GraduationCap, Lock } from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { Department } from '@/types'

export default function StudentsListPage() {
  const { university } = useUniversity()
  const { college } = useCollege()
  const { canCreateStudent } = usePermissions()
  
  const [search, setSearch] = useState('')
  const [searchDebounced, setSearchDebounced] = useState('')
  const [filters, setFilters] = useState({
    department: '',
    year: '',
    status: 'active',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [departments, setDepartments] = useState<Department[]>([])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounced(search)
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  // Fetch departments for filter
  useEffect(() => {
    if (!university || !college) return
    
    const fetchDepartments = async () => {
      try {
        const response = await apiClient.get<{ data: Department[] }>(
          `/admin/universities/${university.id}/colleges/${college.id}/departments`
        )
        setDepartments(response.data)
      } catch (error) {
        console.error('Failed to fetch departments:', error)
      }
    }
    fetchDepartments()
  }, [university, college])

  if (!university || !college) {
    return <div>Loading...</div>
  }

  const { students, pagination, isLoading, error } = useStudents({
    universityId: university.id,
    collegeId: college.id,
    search: searchDebounced,
    ...filters,
    page: currentPage,
    per_page: 20,
  })

  const departmentOptions: SelectOption[] = [
    { label: 'All Departments', value: '' },
    ...departments.map(dept => ({
      label: dept.name,
      value: dept.id,
    })),
  ]

  const yearOptions: SelectOption[] = [
    { label: 'All Years', value: '' },
    { label: 'Year 1', value: '1' },
    { label: 'Year 2', value: '2' },
    { label: 'Year 3', value: '3' },
    { label: 'Year 4', value: '4' },
    { label: 'Year 5', value: '5' },
  ]

  const statusOptions: SelectOption[] = [
    { label: 'Active', value: 'active' },
    { label: 'Suspended', value: 'suspended' },
    { label: 'Graduated', value: 'graduated' },
    { label: 'Dropped', value: 'dropped' },
  ]

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">
            {college.name} - {pagination.total} students
          </p>
        </div>
        <div className="flex space-x-2">
          {canCreateStudent && (
            <>
              <Button variant="outline" className="flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Bulk Import</span>
              </Button>
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Enroll Student</span>
              </Button>
            </>
          )}
          {!canCreateStudent && (
            <Button disabled className="flex items-center space-x-2 opacity-50 cursor-not-allowed">
              <Lock className="w-4 h-4" />
              <span>No Permission</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name, enrollment number, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select
            value={filters.department}
            onChange={(value) => {
              setFilters({ ...filters, department: value })
              setCurrentPage(1)
            }}
            options={departmentOptions}
          />
          
          <Select
            value={filters.year}
            onChange={(value) => {
              setFilters({ ...filters, year: value })
              setCurrentPage(1)
            }}
            options={yearOptions}
          />
          
          <Select
            value={filters.status}
            onChange={(value) => {
              setFilters({ ...filters, status: value })
              setCurrentPage(1)
            }}
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

      {/* Students Grid */}
      {!isLoading && students.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.last_page > 1 && (
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{' '}
                  {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of{' '}
                  {pagination.total} results
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    disabled={pagination.current_page === 1}
                  >
                    Previous
                  </Button>
                  
                  {/* Page numbers */}
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                      let pageNumber
                      if (pagination.last_page <= 5) {
                        pageNumber = i + 1
                      } else if (pagination.current_page <= 3) {
                        pageNumber = i + 1
                      } else if (pagination.current_page >= pagination.last_page - 2) {
                        pageNumber = pagination.last_page - 4 + i
                      } else {
                        pageNumber = pagination.current_page - 2 + i
                      }

                      return (
                        <Button
                          key={pageNumber}
                          variant={pagination.current_page === pageNumber ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(pageNumber)}
                          className="w-10"
                        >
                          {pageNumber}
                        </Button>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                    disabled={pagination.current_page === pagination.last_page}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </>
      )}

      {/* Empty State */}
      {!isLoading && students.length === 0 && (
        <Card className="p-12 text-center">
          <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No students found</h3>
          <p className="text-gray-600 mb-4">
            {searchDebounced || filters.department || filters.year
              ? 'Try adjusting your filters or search query'
              : 'Get started by enrolling your first student'}
          </p>
          {!searchDebounced && !filters.department && !filters.year && (
            <Button className="flex items-center space-x-2 mx-auto">
              <Plus className="w-4 h-4" />
              <span>Enroll First Student</span>
            </Button>
          )}
        </Card>
      )}
    </div>
  )
}
