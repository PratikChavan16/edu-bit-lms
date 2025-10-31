import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { initializeEcho, getEcho, disconnectEcho } from '@/lib/echo'
import { AUTH_TOKEN_KEY } from '@/lib/constants'

export function useWebSocket() {
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated && typeof window !== 'undefined') {
      const token = localStorage.getItem(AUTH_TOKEN_KEY)
      
      if (token) {
        // Initialize Echo with auth token
        initializeEcho(token)
        
        console.log('✅ WebSocket connected')
      }
    }

    return () => {
      // Cleanup on unmount or logout
      if (!isAuthenticated) {
        disconnectEcho()
        console.log('❌ WebSocket disconnected')
      }
    }
  }, [isAuthenticated])

  return {
    echo: getEcho(),
  }
}
