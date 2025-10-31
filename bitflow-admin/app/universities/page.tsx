'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/ui/pagination'
import { useToast } from '@/components/ui/toast'
import { UniversitiesTable } from '@/components/universities/UniversitiesTable'
import { TableSkeleton } from '@/components/ui/SkeletonLayouts'
import { ButtonLoading } from '@/components/ui/LoadingStates'
import { CreateUniversityModal, type CreateUniversityData } from '@/components/universities/CreateUniversityModal'
import { EditUniversityModal, type UpdateUniversityData } from '@/components/universities/EditUniversityModal'
import { SelectionCounter } from '@/components/common/SelectionCounter'
import { BulkActionsToolbar } from '@/components/common/BulkActionsToolbar'
import { AdvancedFilterPanel, type FilterField, type FilterValue, type SortField } from '@/components/common/AdvancedFilterPanel'
import { useBulkSelectionStore, useUniversitySelectionCount } from '@/stores/useBulkSelectionStore'
import { useFilterPersistence } from '@/hooks/useFilterPersistence'
import { apiClient } from '@/lib/api-client'
import type { ApiResponse, University } from '@/types'
import { Plus, Search } from 'lucide-react'

export default function UniversitiesPage() {
  const router = useRouter()
  const toast = useToast()
  const [universities, setUniversities] = useState<University[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(15)
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  
  // Filter persistence
  const {
    filters,
    sort: sortFields,
    persistFilters,
    persistSort,
    clearPersisted,
    isInitialized,
  } = useFilterPersistence({
    storageKey: 'universities-filters',
    enableLocalStorage: true,
    enableURLParams: true,
  })

  // Advanced filters state
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  // Bulk selection state
  const selectionCount = useUniversitySelectionCount()
  const selectedUniversities = useBulkSelectionStore((state) => state.selectedUniversities)
  const clearUniversitySelection = useBulkSelectionStore((state) => state.clearUniversitySelection)
  
  // Get array of selected IDs
  const selectedIds = Array.from(selectedUniversities)

  // Define filter fields
  const filterFields: FilterField[] = [
    {
      id: 'name',
      label: 'University Name',
      type: 'text',
      placeholder: 'Search by name...',
      sortable: true,
    },
    {
      id: 'domain',
      label: 'Domain',
      type: 'text',
      placeholder: 'e.g., example.edu',
      sortable: true,
    },
    {
      id: 'email',
      label: 'Email',
      type: 'text',
      placeholder: 'Search by email...',
      sortable: false,
    },
    {
      id: 'status',
      label: 'Status',
      type: 'multiselect',
      placeholder: 'Select statuses...',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'suspended', label: 'Suspended' },
      ],
      sortable: true,
    },
    {
      id: 'established_year',
      label: 'Established Year',
      type: 'numberrange',
      placeholder: 'Year range',
      min: 1800,
      max: new Date().getFullYear(),
      sortable: true,
    },
    {
      id: 'storage_quota_gb',
      label: 'Storage Quota (GB)',
      type: 'numberrange',
      placeholder: 'Storage range',
      min: 1,
      max: 10000,
      sortable: true,
    },
  ]

  const fetchUniversities = async () => {
    setIsLoading(true)
    try {
      // Check if we have advanced filters or sorting
      const hasFilters = Object.keys(filters).length > 0
      const hasSorting = sortFields.length > 0
      
      if (hasFilters || hasSorting) {
        // Use advanced search endpoint
        const response = await apiClient.post<ApiResponse<University[]>>(
          '/universities/search',
          {
            filters: filters,
            sort: sortFields,
            page: currentPage,
            per_page: itemsPerPage,
          }
        )
        // Handle new API response format
        if (response.success) {
          setUniversities(response.data || [])
          setTotalPages(response.meta?.last_page || 1)
          setTotalItems(response.meta?.total || 0)
        }
      } else {
        // Use regular endpoint with basic search
        const response = await apiClient.get<ApiResponse<University[]>>(
          `/universities?page=${currentPage}&per_page=${itemsPerPage}&search=${searchQuery}`
        )
        // Handle new API response format
        if (response.success) {
          const data = response.data as any
          const universities = data?.universities || data || []
          setUniversities(universities)
          setTotalPages(response.meta?.last_page || 1)
          setTotalItems(response.meta?.total || 0)
        }
      }
    } catch (error) {
      console.error('Failed to fetch universities:', error)
      toast.error('Failed to load universities')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Only fetch after filter persistence is initialized
    if (isInitialized) {
      fetchUniversities()
    }
  }, [currentPage, itemsPerPage, searchQuery, filters, sortFields, isInitialized])

  const handleCreate = async (data: CreateUniversityData) => {
    setIsCreating(true)
    try {
      const response = await apiClient.post('/universities', data)
      toast.success(`University "${data.name}" and owner account created successfully`)
      fetchUniversities()
      return response // Return response so modal can access owner credentials
    } finally {
      setIsCreating(false)
    }
  }

  const handleEdit = (university: University) => {
    setSelectedUniversity(university)
    setIsEditModalOpen(true)
  }

  const handleUpdate = async (id: string, data: UpdateUniversityData) => {
    await apiClient.put(`/universities/${id}`, data)
    toast.success(`University "${data.name}" updated successfully`)
    fetchUniversities()
    setIsEditModalOpen(false)
  }

  const handleDelete = async (id: string) => {
    const university = universities.find(u => u.id === id)
    if (confirm(`Are you sure you want to delete ${university?.name}?`)) {
      try {
        await apiClient.delete(`/universities/${id}`)
        toast.success('University deleted successfully')
        fetchUniversities()
      } catch (error) {
        toast.error('Failed to delete university')
      }
    }
  }

  const handleRestore = async (id: string) => {
    try {
      await apiClient.post(`/universities/${id}/restore`)
      toast.success('University restored successfully')
      fetchUniversities()
    } catch (error) {
      toast.error('Failed to restore university')
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchUniversities()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Universities</h1>
          <p className="text-gray-500 mt-1">
            Manage all universities on the platform
          </p>
        </div>
        <ButtonLoading 
          onClick={() => setIsCreateModalOpen(true)}
          isLoading={isCreating}
          loadingText="Creating..."
        >
          <Plus className="h-4 w-4 mr-2" />
          Create University
        </ButtonLoading>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-500">Total Universities</p>
          <p className="text-2xl font-bold">{totalItems}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-bold">
            {universities.filter((u) => u.status === 'active').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-500">Suspended</p>
          <p className="text-2xl font-bold">
            {universities.filter((u) => u.status === 'suspended').length}
          </p>
        </div>
      </div>

      {/* Advanced Filters */}
      <AdvancedFilterPanel
        fields={filterFields}
        filters={filters}
        onFiltersChange={persistFilters}
        onApply={() => {
          setCurrentPage(1)
          fetchUniversities()
        }}
        onReset={() => {
          clearPersisted()
          setCurrentPage(1)
          fetchUniversities()
        }}
        isOpen={isFilterOpen}
        onToggle={() => setIsFilterOpen(!isFilterOpen)}
        entityType="university"
        enablePresets={true}
        enableSorting={true}
        currentSort={sortFields}
        onSortChange={persistSort}
      />

      {/* Search */}
      <div className="bg-white p-4 rounded-lg border">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Quick search by name, email, or domain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
      </div>

      {/* Selection Counter */}
      <SelectionCounter
        count={selectionCount}
        totalCount={universities.length}
        onClear={clearUniversitySelection}
        resourceType="universities"
      />

      {/* Bulk Actions Toolbar */}
      <BulkActionsToolbar
        selectedIds={selectedIds}
        resourceType="universities"
        onActionComplete={() => {
          fetchUniversities()
          clearUniversitySelection()
        }}
      />

      {/* Table */}
      <div className="bg-white rounded-lg border">
        {isLoading ? (
          <TableSkeleton rows={10} columns={7} />
        ) : (
          <>
            <UniversitiesTable
              universities={universities}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRestore={handleRestore}
              onRowClick={(universityId) => router.push(`/universities/${universityId}`)}
            />

            {universities.length > 0 && (
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
      <CreateUniversityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
      />

      {/* Edit Modal */}
      <EditUniversityModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedUniversity(null)
        }}
        onSubmit={handleUpdate}
        university={selectedUniversity}
      />
    </div>
  )
}
