import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'
import { Department } from '@/types'

interface UseDepartmentsParams {
  universityId: string
  collegeId: string
  search?: string
  status?: string
}

interface UseDepartmentsReturn {
  departments: Department[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useDepartments(params: UseDepartmentsParams): UseDepartmentsReturn {
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDepartments = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const queryParams = new URLSearchParams()
      if (params.search) queryParams.append('search', params.search)
      if (params.status) queryParams.append('status', params.status)

      const response = await apiClient.get<{ data: Department[] }>(
        `/admin/universities/${params.universityId}/colleges/${params.collegeId}/departments?${queryParams.toString()}`
      )

      setDepartments(response.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch departments')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [params.universityId, params.collegeId, params.search, params.status])

  return {
    departments,
    isLoading,
    error,
    refetch: fetchDepartments,
  }
}
