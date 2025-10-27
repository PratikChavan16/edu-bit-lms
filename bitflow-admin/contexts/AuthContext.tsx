'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'

export interface User {
  id: string
  name: string
  email: string
  role: string
  university_id?: string
  college_id?: string
  avatar?: string
}

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

const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'user_data'

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
        const token = localStorage.getItem(TOKEN_KEY)
        const userData = localStorage.getItem(USER_KEY)

        if (token && userData) {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)

          // Verify token is still valid
          try {
            const response: any = await apiClient.get('/auth/me')
            if (response.success) {
              setUser(response.data)
              localStorage.setItem(USER_KEY, JSON.stringify(response.data))
            }
          } catch (error) {
            // Token invalid, clear auth
            handleLogout()
          }
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
          localStorage.setItem(TOKEN_KEY, access_token)
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

        // Store tokens and user data in localStorage
        localStorage.setItem(TOKEN_KEY, access_token)
        localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token)
        localStorage.setItem(USER_KEY, JSON.stringify(userData))

        // Also store token in cookie for middleware
        setCookie('bitflow_auth_token', access_token, 7)

        setUser(userData)
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
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    
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
        setUser(response.data)
        localStorage.setItem(USER_KEY, JSON.stringify(response.data))
      }
    } catch (error) {
      console.error('Refresh user error:', error)
      handleLogout()
    }
  }

  const hasRole = (role: string | string[]): boolean => {
    if (!user) return false

    const roles = Array.isArray(role) ? role : [role]
    return roles.includes(user.role)
  }

  const hasPermission = (permission: string | string[]): boolean => {
    if (!user) return false

    const permissions = Array.isArray(permission) ? permission : [permission]
    const userRoleLevel = ROLE_HIERARCHY[user.role] || 0

    // Check if user role meets any of the required permission levels
    return permissions.some((perm) => {
      const requiredLevel = ROLE_HIERARCHY[perm] || 0
      return userRoleLevel >= requiredLevel
    })
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
        } else if (requiredRoles && !requiredRoles.includes(user.role)) {
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

    if (!user || (requiredRoles && !requiredRoles.includes(user.role))) {
      return null
    }

    return <Component {...props} />
  }
}
