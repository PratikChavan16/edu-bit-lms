import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'
import { Faculty } from '@/types'

interface UseFacultyParams {
  universityId: string
  collegeId: string
  search?: string
  department?: string
  designation?: string
}

interface UseFacultyReturn {
  faculty: Faculty[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useFaculty(params: UseFacultyParams): UseFacultyReturn {
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFaculty = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const queryParams = new URLSearchParams()
      if (params.search) queryParams.append('search', params.search)
      if (params.department) queryParams.append('department', params.department)
      if (params.designation) queryParams.append('designation', params.designation)

      const response = await apiClient.get<{ data: Faculty[] }>(
        `/admin/universities/${params.universityId}/colleges/${params.collegeId}/academic-staff?${queryParams.toString()}`
      )

      setFaculty(response.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch faculty')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFaculty()
  }, [params.universityId, params.collegeId, params.search, params.department, params.designation])

  return {
    faculty,
    isLoading,
    error,
    refetch: fetchFaculty,
  }
}
