import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'
import { useGodModeStore } from '@/stores/god-mode-store'
import type { User, ApiResponse } from '@/types'

export function useUsers() {
  const { selectedUniversityId } = useGodModeStore()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiClient.get<ApiResponse<User[]>>('/users')
      setUsers(response.data || [])
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  // Re-fetch when God Mode selection changes
  useEffect(() => {
    fetchUsers()
  }, [selectedUniversityId])

  return {
    users,
    isLoading,
    error,
    refetch: fetchUsers,
  }
}
