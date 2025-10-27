'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/ui/pagination'
import { useToast } from '@/components/ui/toast'
import { CreateCollegeModal, type CreateCollegeData } from '@/components/colleges/CreateCollegeModal'
import { EditCollegeModal, type UpdateCollegeData } from '@/components/colleges/EditCollegeModal'
import { apiClient } from '@/lib/api-client'
import type { ApiResponse, College, University } from '@/types'
import { Plus, Search, Edit, Trash2, RotateCcw, Building2, Users, TrendingUp, AlertCircle, Shield } from 'lucide-react'

export default function CollegesPage() {
  const toast = useToast()
  const [colleges, setColleges] = useState<College[]>([])
  const [universities, setUniversities] = useState<University[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(15)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUniversity, setSelectedUniversity] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null)

  const fetchColleges = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: itemsPerPage.toString(),
      })
      
      if (searchQuery) params.append('search', searchQuery)
      if (selectedUniversity) params.append('university_id', selectedUniversity)
      if (selectedStatus) params.append('status', selectedStatus)

      const response = await apiClient.get<ApiResponse<College[]>>(
        `/colleges?${params.toString()}`
      )
      setColleges(response.data)
      setTotalPages(response.meta?.last_page || 1)
      setTotalItems(response.meta?.total || 0)
    } catch (error) {
      console.error('Failed to fetch colleges:', error)
      toast.error('Failed to fetch colleges')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUniversities = async () => {
    try {
      const response = await apiClient.get<ApiResponse<University[]>>('/universities?per_page=100')
      setUniversities(response.data)
    } catch (error) {
      console.error('Failed to fetch universities:', error)
    }
  }

  useEffect(() => {
    fetchUniversities()
  }, [])

  useEffect(() => {
    fetchColleges()
  }, [currentPage, itemsPerPage])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchColleges()
  }

  const handleCreate = async (data: CreateCollegeData) => {
    await apiClient.post('/colleges', data)
    toast.success(`College "${data.name}" created successfully`)
    fetchColleges()
  }

  const handleEdit = (college: College) => {
    setSelectedCollege(college)
    setIsEditModalOpen(true)
  }

  const handleUpdate = async (id: string, data: UpdateCollegeData) => {
    await apiClient.put(`/colleges/${id}`, data)
    toast.success(`College updated successfully`)
    fetchColleges()
    setIsEditModalOpen(false)
  }

  const handleDelete = async (id: string) => {
    const college = colleges.find(c => c.id === id)
    if (confirm(`Are you sure you want to delete ${college?.name}?`)) {
      try {
        await apiClient.delete(`/colleges/${id}`)
        toast.success('College deleted successfully')
        fetchColleges()
      } catch (error) {
        toast.error('Failed to delete college')
      }
    }
  }

  const handleRestore = async (id: string) => {
    try {
      await apiClient.post(`/colleges/${id}/restore`)
      toast.success('College restored successfully')
      fetchColleges()
    } catch (error) {
      toast.error('Failed to restore college')
    }
  }

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      suspended: 'bg-red-100 text-red-800 border-red-200',
    }
    return statusStyles[status as keyof typeof statusStyles] || statusStyles.inactive
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Colleges</h1>
          <p className="text-gray-500 mt-1">
            Manage all colleges across universities (God Mode)
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create College
        </Button>
      </div>

      {/* God Mode Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 text-sm">God Mode Access</h3>
            <p className="text-xs text-blue-700 mt-1">
              As Bitflow Owner, you have full access to create, edit, and delete colleges across all universities. 
              Typically, colleges are created by University Owners within their respective universities. 
              Use this access for onboarding, support, and emergency situations. All actions are logged in audit logs.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Colleges</p>
              <p className="text-2xl font-bold">{totalItems}</p>
            </div>
            <Building2 className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {colleges.filter((c) => c.status === 'active').length}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Suspended</p>
              <p className="text-2xl font-bold text-red-600">
                {colleges.filter((c) => c.status === 'suspended').length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Enrollment</p>
              <p className="text-2xl font-bold">
                {colleges.reduce((sum, c) => sum + (c.current_enrollment || 0), 0).toLocaleString()}
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-lg border">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search colleges by name, code, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={selectedUniversity}
                onChange={(e) => setSelectedUniversity(e.target.value)}
              >
                <option value="">All Universities</option>
                {universities.map((uni) => (
                  <option key={uni.id} value={uni.id}>
                    {uni.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  College
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  University
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Loading colleges...
                  </td>
                </tr>
              ) : colleges.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Building2 className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500">No colleges found</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {searchQuery || selectedUniversity || selectedStatus
                          ? 'Try adjusting your filters'
                          : 'Colleges will appear here once universities create them'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                colleges.map((college) => (
                  <tr key={college.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{college.name}</div>
                        <div className="text-sm text-gray-500">Code: {college.code}</div>
                        {college.established_year && (
                          <div className="text-xs text-gray-400">Est. {college.established_year}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {college.university?.name || universities.find(u => u.id === college.university_id)?.name || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadge(college.status)}`}>
                        {college.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {college.current_enrollment?.toLocaleString() || 0}
                      </div>
                      {college.stats && (
                        <div className="text-xs text-gray-500">
                          {college.stats.enrollment_percentage.toFixed(1)}% filled
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {college.capacity?.toLocaleString() || 'N/A'}
                      </div>
                      {college.capacity && college.current_enrollment && (
                        <div className="text-xs text-gray-500">
                          {college.capacity - college.current_enrollment} available
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{college.email}</div>
                      {college.phone && (
                        <div className="text-xs text-gray-500">{college.phone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {college.status !== 'suspended' ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(college)}
                              title="Edit College"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(college.id)}
                              className="text-red-600 hover:text-red-700"
                              title="Delete College"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRestore(college.id)}
                            className="text-blue-600 hover:text-blue-700"
                            title="Restore College"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && colleges.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        )}
      </div>

      {/* Create Modal */}
      <CreateCollegeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
        universities={universities}
      />

      {/* Edit Modal */}
      <EditCollegeModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedCollege(null)
        }}
        onSubmit={handleUpdate}
        college={selectedCollege}
      />
    </div>
  )
}
