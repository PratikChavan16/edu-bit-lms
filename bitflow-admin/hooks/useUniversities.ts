import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'
import { useGodModeStore } from '@/stores/god-mode-store'
import { useWebSocket } from '@/hooks/useWebSocket'
import type { University, ApiResponse } from '@/types'

export function useUniversities() {
  const { selectedUniversityId } = useGodModeStore()
  const { echo } = useWebSocket()
  const [universities, setUniversities] = useState<University[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchUniversities = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiClient.get<ApiResponse<University[]>>('/universities')
      setUniversities(response.data || [])
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  // Re-fetch when God Mode selection changes
  useEffect(() => {
    fetchUniversities()
  }, [selectedUniversityId])

  // Listen for real-time events
  useEffect(() => {
    if (!echo) return

    const channel = echo.channel('universities')

    channel
      .listen('.university.created', (event: any) => {
        console.log('🔔 University created:', event)
        // Add new university to the list
        setUniversities(prev => [...prev, event])
      })
      .listen('.university.updated', (event: any) => {
        console.log('🔔 University updated:', event)
        // Update existing university in the list
        setUniversities(prev => 
          prev.map(u => u.id === event.id ? { ...u, ...event } : u)
        )
      })

    return () => {
      echo.leave('universities')
    }
  }, [echo])

  return {
    universities,
    isLoading,
    error,
    refetch: fetchUniversities,
  }
}
