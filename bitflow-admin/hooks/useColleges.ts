import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'
import { useGodModeStore } from '@/stores/god-mode-store'
import { useWebSocket } from '@/hooks/useWebSocket'
import type { College, ApiResponse } from '@/types'

export function useColleges() {
  const { selectedUniversityId } = useGodModeStore()
  const { echo } = useWebSocket()
  const [colleges, setColleges] = useState<College[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchColleges = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiClient.get<ApiResponse<College[]>>('/colleges')
      setColleges(response.data || [])
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  // Re-fetch when God Mode selection changes
  useEffect(() => {
    fetchColleges()
  }, [selectedUniversityId])

  // Listen for real-time events
  useEffect(() => {
    if (!echo) return

    const channel = echo.channel('colleges')

    channel
      .listen('.college.created', (event: any) => {
        console.log('🔔 College created:', event)
        // Add new college to the list
        setColleges(prev => [...prev, event])
      })
      .listen('.college.updated', (event: any) => {
        console.log('🔔 College updated:', event)
        // Update existing college in the list
        setColleges(prev => 
          prev.map(c => c.id === event.id ? { ...c, ...event } : c)
        )
      })

    return () => {
      echo.leave('colleges')
    }
  }, [echo])

  return {
    colleges,
    isLoading,
    error,
    refetch: fetchColleges,
  }
}
