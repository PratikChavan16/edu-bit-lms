'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/ui/pagination'
import { useToast } from '@/components/ui/toast'
import { CollegesTable } from '@/components/colleges/CollegesTable'
import { TableSkeleton } from '@/components/ui/SkeletonLayouts'
import { ButtonLoading } from '@/components/ui/LoadingStates'
import { CreateCollegeModal, type CreateCollegeData } from '@/components/colleges/CreateCollegeModal'
import { EditCollegeModal, type UpdateCollegeData } from '@/components/colleges/EditCollegeModal'
import { SelectionCounter } from '@/components/common/SelectionCounter'
import { BulkActionsToolbar } from '@/components/common/BulkActionsToolbar'
import { useBulkSelectionStore, useCollegeSelectionCount } from '@/stores/useBulkSelectionStore'
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
  const [isCreating, setIsCreating] = useState(false)
  
  // Bulk selection state
  const selectionCount = useCollegeSelectionCount()
  const selectedColleges = useBulkSelectionStore((state) => state.selectedColleges)
  const clearCollegeSelection = useBulkSelectionStore((state) => state.clearCollegeSelection)
  
  // Get array of selected IDs
  const selectedIds = Array.from(selectedColleges)

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
      // Handle new API response format
      if (response.success) {
        const data = response.data as any
        const colleges = data?.colleges || data || []
        setColleges(colleges)
        setTotalPages(response.meta?.last_page || 1)
        setTotalItems(response.meta?.total || 0)
      }
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
      // Handle new API response format
      if (response.success) {
        const data = response.data as any
        const universities = data?.universities || data || []
        setUniversities(universities)
      }
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
    setIsCreating(true)
    try {
      await apiClient.post('/colleges', data)
      toast.success(`College "${data.name}" created successfully`)
      fetchColleges()
    } finally {
      setIsCreating(false)
    }
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
        <ButtonLoading 
          onClick={() => setIsCreateModalOpen(true)}
          isLoading={isCreating}
          loadingText="Creating..."
        >
          <Plus className="h-4 w-4 mr-2" />
          Create College
        </ButtonLoading>
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

      {/* Selection Counter */}
      <SelectionCounter
        count={selectionCount}
        totalCount={colleges.length}
        onClear={clearCollegeSelection}
        resourceType="colleges"
      />

      {/* Bulk Actions Toolbar */}
      <BulkActionsToolbar
        selectedIds={selectedIds}
        resourceType="colleges"
        onActionComplete={() => {
          fetchColleges()
          clearCollegeSelection()
        }}
      />

      {/* Table */}
      <div className="bg-white rounded-lg border">
        {isLoading ? (
          <TableSkeleton rows={10} columns={8} />
        ) : (
          <>
            <CollegesTable
              colleges={colleges}
              universities={universities}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRestore={handleRestore}
            />

            {colleges.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            )}
          </>
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
