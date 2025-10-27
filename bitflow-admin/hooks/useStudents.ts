import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'
import { Student, PaginatedResponse } from '@/types'

interface UseStudentsParams {
  universityId: string
  collegeId: string
  search?: string
  department?: string
  year?: string
  status?: string
  page?: number
  per_page?: number
}

interface UseStudentsReturn {
  students: Student[]
  pagination: {
    current_page: number
    per_page: number
    total: number
    last_page: number
  }
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useStudents(params: UseStudentsParams): UseStudentsReturn {
  const [students, setStudents] = useState<Student[]>([])
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 20,
    total: 0,
    last_page: 1,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStudents = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const queryParams = new URLSearchParams()
      if (params.search) queryParams.append('search', params.search)
      if (params.department) queryParams.append('department', params.department)
      if (params.year) queryParams.append('year', params.year)
      if (params.status) queryParams.append('status', params.status)
      queryParams.append('page', String(params.page || 1))
      queryParams.append('per_page', String(params.per_page || 20))

      const response = await apiClient.get<{
        data: Student[]
        pagination: {
          current_page: number
          per_page: number
          total: number
          last_page: number
        }
      }>(
        `/admin/universities/${params.universityId}/colleges/${params.collegeId}/students?${queryParams.toString()}`
      )

      setStudents(response.data)
      setPagination(response.pagination)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch students')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [
    params.universityId,
    params.collegeId,
    params.search,
    params.department,
    params.year,
    params.status,
    params.page,
  ])

  return {
    students,
    pagination,
    isLoading,
    error,
    refetch: fetchStudents,
  }
}
