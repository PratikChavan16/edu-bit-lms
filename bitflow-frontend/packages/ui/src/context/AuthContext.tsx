'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { auth } from '@bitflow/api-client';

const { authApi, TokenStorage } = auth;
type User = auth.User;
type LoginCredentials = auth.LoginCredentials;
type PortalType = auth.PortalType;

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  hasRole: (allowedRoles: string[]) => boolean;
  hasPortalAccess: (allowedPortals: PortalType[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Check if we have tokens
      const token = TokenStorage.getAccessToken();
      const storedUser = TokenStorage.getUser();

      if (!token || !storedUser) {
        setUser(null);
        return;
      }

      // Verify session with backend
      const isValid = await authApi.verifySession();
      
      if (isValid) {
        // Get fresh user data
        const userData = await authApi.me();
        setUser(userData);
      } else {
        // Session invalid, clear everything
        TokenStorage.clearAll();
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      TokenStorage.clearAll();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await authApi.login(credentials);
      setUser(response.user);
      
      // Redirect based on portal
      if (typeof window !== 'undefined') {
        const portalRoutes: Record<PortalType, string> = {
          'super-admin': '/dashboard',
          'college-admin': '/dashboard',
          'faculty': '/dashboard',
          'student': '/dashboard',
          'parent': '/dashboard',
        };
        window.location.href = portalRoutes[credentials.portal] || '/dashboard';
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await authApi.logout();
      setUser(null);
      
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check if user has required role
  const hasRole = useCallback(
    (allowedRoles: string[]): boolean => {
      if (!user) return false;
      return allowedRoles.includes(user.role);
    },
    [user]
  );

  // Check if user has access to portal
  const hasPortalAccess = useCallback(
    (allowedPortals: PortalType[]): boolean => {
      if (!user) return false;
      return allowedPortals.includes(user.portal);
    },
    [user]
  );

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!user) return;

    // Refresh token every 50 minutes (assuming 60 min expiry)
    const refreshInterval = setInterval(
      async () => {
        try {
          const refreshToken = TokenStorage.getRefreshToken();
          if (refreshToken) {
            const response = await authApi.refresh(refreshToken);
            setUser(response.user);
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
          await logout();
        }
      },
      50 * 60 * 1000
    ); // 50 minutes

    return () => clearInterval(refreshInterval);
  }, [user, logout]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth,
    hasRole,
    hasPortalAccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
