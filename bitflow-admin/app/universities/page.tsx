'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/ui/pagination'
import { useToast } from '@/components/ui/toast'
import { UniversitiesTable } from '@/components/universities/UniversitiesTable'
import { CreateUniversityModal, type CreateUniversityData } from '@/components/universities/CreateUniversityModal'
import { EditUniversityModal, type UpdateUniversityData } from '@/components/universities/EditUniversityModal'
import { apiClient } from '@/lib/api-client'
import type { ApiResponse, University } from '@/types'
import { Plus, Search } from 'lucide-react'

export default function UniversitiesPage() {
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

  const fetchUniversities = async () => {
    setIsLoading(true)
    try {
      const response = await apiClient.get<ApiResponse<University[]>>(
        `/universities?page=${currentPage}&per_page=${itemsPerPage}&search=${searchQuery}`
      )
      setUniversities(response.data)
      setTotalPages(response.meta?.last_page || 1)
      setTotalItems(response.meta?.total || 0)
    } catch (error) {
      console.error('Failed to fetch universities:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUniversities()
  }, [currentPage, itemsPerPage, searchQuery])

  const handleCreate = async (data: CreateUniversityData) => {
    const response = await apiClient.post('/universities', data)
    toast.success(`University "${data.name}" and owner account created successfully`)
    fetchUniversities()
    return response // Return response so modal can access owner credentials
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
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create University
        </Button>
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

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-lg border">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search universities by name, email, or domain..."
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

      {/* Table */}
      <div className="bg-white rounded-lg border">
        <UniversitiesTable
          universities={universities}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRestore={handleRestore}
        />

        {!isLoading && universities.length > 0 && (
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
