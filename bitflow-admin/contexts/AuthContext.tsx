'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_DATA_KEY } from '@/lib/constants'
import { User } from '@/types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  hasPermission: (permission: string | string[]) => boolean
  hasRole: (role: string | string[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Export AuthContext for testing
export { AuthContext }

// Helper function to set cookie
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

// Helper function to delete cookie
const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
}

// Helper to normalize user data from backend (handles both login and /auth/me responses)
const normalizeUserData = (userData: any): User => {
  return {
    id: userData.id,
    email: userData.email,
    username: userData.username,
    full_name: userData.full_name,
    university_id: userData.university_id,
    // Handle roles - could be array of strings or array of objects with slug
    roles: Array.isArray(userData.roles) 
      ? userData.roles.map((role: any) => typeof role === 'string' ? role : role.slug)
      : [],
    // Handle permissions - could be array of strings or array of objects with slug
    permissions: Array.isArray(userData.permissions)
      ? userData.permissions.map((perm: any) => typeof perm === 'string' ? perm : perm.slug)
      : [],
    status: userData.status,
  }
}

// Role hierarchy for permission checks
const ROLE_HIERARCHY: Record<string, number> = {
  bitflow_owner: 100,
  university_owner: 90,
  super_admin: 80,
  principal: 70,
  college_admin: 60,
  super_academics: 55,
  admission_admin: 50,
  super_accountant: 45,
  college_accounts_admin: 40,
  college_fee_admin: 35,
  super_non_teaching_manager: 30,
  faculty: 20,
  teacher: 20,
  student: 10,
  parent: 5,
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem(AUTH_TOKEN_KEY)
        const userData = localStorage.getItem(USER_DATA_KEY)
        
        console.log('🔐 Loading user from localStorage...')
        console.log('Token exists:', !!token)
        console.log('User data exists:', !!userData)
        console.log('User data raw:', userData)

        if (token && userData) {
          const parsedUser = normalizeUserData(JSON.parse(userData))
          console.log('Parsed user:', parsedUser)
          setUser(parsedUser)

          // Verify token is still valid
          try {
            const response: any = await apiClient.get('/auth/me')
            console.log('/auth/me response:', response)
            if (response.success) {
              const normalizedUser = normalizeUserData(response.data)
              setUser(normalizedUser)
              localStorage.setItem(USER_DATA_KEY, JSON.stringify(normalizedUser))
            }
          } catch (error) {
            console.error('Token verification failed:', error)
            // Token invalid, clear auth
            handleLogout()
          }
        } else {
          console.log('No token or user data found - user needs to login')
        }
      } catch (error) {
        console.error('Error loading user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!user) return

    // Refresh token every 50 minutes (assuming 60 min expiry)
    const interval = setInterval(async () => {
      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
        if (!refreshToken) return

        const response: any = await apiClient.post('/auth/refresh', {
          refresh_token: refreshToken,
        })

        if (response.success) {
          const { access_token, refresh_token } = response.data
          localStorage.setItem(AUTH_TOKEN_KEY, access_token)
          localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token)
        }
      } catch (error) {
        console.error('Token refresh failed:', error)
        handleLogout()
      }
    }, 50 * 60 * 1000) // 50 minutes

    return () => clearInterval(interval)
  }, [user])

  const login = async (email: string, password: string) => {
    try {
      const response: any = await apiClient.post('/auth/login', {
        email,
        password,
      })

      if (response.success) {
        const { access_token, refresh_token, user: userData } = response.data

        // Normalize user data
        const normalizedUser = normalizeUserData(userData)

        // Store tokens and user data in localStorage
        localStorage.setItem(AUTH_TOKEN_KEY, access_token)
        localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token)
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(normalizedUser))

        // Also store token in cookie for middleware
        setCookie('bitflow_auth_token', access_token, 7)

        setUser(normalizedUser)
        router.push('/universities')
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_DATA_KEY)
    
    // Also delete cookie
    deleteCookie('bitflow_auth_token')
    
    setUser(null)
  }

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      handleLogout()
      router.push('/login')
    }
  }

  const refreshUser = async () => {
    try {
      const response: any = await apiClient.get('/auth/me')
      if (response.success) {
        const normalizedUser = normalizeUserData(response.data)
        setUser(normalizedUser)
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(normalizedUser))
      }
    } catch (error) {
      console.error('Refresh user error:', error)
      handleLogout()
    }
  }

  const hasRole = (role: string | string[]): boolean => {
    if (!user || !user.roles) return false

    const roles = Array.isArray(role) ? role : [role]
    // Check if user has any of the required roles
    return user.roles.some(userRole => roles.includes(userRole))
  }

  const hasPermission = (permission: string | string[]): boolean => {
    if (!user || !user.roles) return false

    const permissions = Array.isArray(permission) ? permission : [permission]
    
    // Check if user has any of the required roles
    return user.roles.some(userRole => permissions.includes(userRole))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
        hasPermission,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// HOC for protecting routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles?: string[]
) {
  return function ProtectedRoute(props: P) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isLoading) {
        if (!user) {
          router.push('/login')
        } else if (requiredRoles && user.roles && !user.roles.some(role => requiredRoles.includes(role))) {
          router.push('/unauthorized')
        }
      }
    }, [user, isLoading, router])

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )
    }

    if (!user || (requiredRoles && user.roles && !user.roles.some(role => requiredRoles.includes(role)))) {
      return null
    }

    return <Component {...props} />
  }
}
