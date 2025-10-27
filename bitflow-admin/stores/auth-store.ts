import { create } from 'zustand'
import { apiClient } from '@/lib/api-client'
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_DATA_KEY } from '@/lib/constants'
import type { User, LoginResponse } from '@/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  loadUser: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', {
        email,
        password,
      })

      // API client returns the full JSON response body
      const { access_token, refresh_token, user } = response.data

      // Store tokens and user data
      localStorage.setItem(AUTH_TOKEN_KEY, access_token)
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token)
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(user))

      // Also set cookie for middleware
      document.cookie = `bitflow_auth_token=${access_token}; path=/; max-age=${60 * 15}` // 15 minutes

      set({ user, isAuthenticated: true, isLoading: false })
    } catch (error: any) {
      set({ isLoading: false })
      throw error
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local storage
      localStorage.removeItem(AUTH_TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
      localStorage.removeItem(USER_DATA_KEY)

      // Clear cookie
      document.cookie = 'bitflow_auth_token=; path=/; max-age=0'

      set({ user: null, isAuthenticated: false })
      
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
  },

  loadUser: () => {
    if (typeof window !== 'undefined') {
      const userDataString = localStorage.getItem(USER_DATA_KEY)
      const token = localStorage.getItem(AUTH_TOKEN_KEY)

      if (userDataString && token) {
        try {
          const user = JSON.parse(userDataString) as User
          set({ user, isAuthenticated: true })
        } catch (error) {
          console.error('Failed to parse user data:', error)
          localStorage.clear()
        }
      }
    }
  },

  setUser: (user: User) => {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user))
    set({ user, isAuthenticated: true })
  },
}))
