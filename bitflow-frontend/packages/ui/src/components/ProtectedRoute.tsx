/**
 * Protected Route Component
 * 
 * Wraps pages that require authentication
 * Redirects to login if not authenticated
 * Optionally checks for specific roles and portals
 */

'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import type { auth } from '@bitflow/api-client';

type PortalType = auth.PortalType;

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
  allowedPortals?: PortalType[];
  requireAuth?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  allowedPortals,
  requireAuth = true,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    // If authentication is required but user is not authenticated
    if (requireAuth && !isAuthenticated) {
      // Save the attempted URL to redirect back after login
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('redirectAfterLogin', pathname);
      }
      router.push(redirectTo);
      return;
    }

    // If authenticated, check role-based access
    if (isAuthenticated && user) {
      // Check allowed roles
      if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(user.role)) {
          router.push('/unauthorized');
          return;
        }
      }

      // Check allowed portals
      if (allowedPortals && allowedPortals.length > 0) {
        if (!allowedPortals.includes(user.portal)) {
          router.push('/unauthorized');
          return;
        }
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, allowedPortals, requireAuth, redirectTo, router, pathname]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and auth is required, don't render (redirecting)
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // If authenticated but doesn't have access, don't render (redirecting)
  if (isAuthenticated && user) {
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return null;
    }
    if (allowedPortals && allowedPortals.length > 0 && !allowedPortals.includes(user.portal)) {
      return null;
    }
  }

  // All checks passed, render children
  return <>{children}</>;
}

// HOC version for page-level protection
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<ProtectedRouteProps, 'children'>
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

// Utility hook to check if current route is accessible
export function useRouteAccess(allowedRoles?: string[], allowedPortals?: PortalType[]) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return { hasAccess: false, reason: 'not-authenticated' as const };
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return { hasAccess: false, reason: 'insufficient-role' as const };
  }

  if (allowedPortals && allowedPortals.length > 0 && !allowedPortals.includes(user.portal)) {
    return { hasAccess: false, reason: 'wrong-portal' as const };
  }

  return { hasAccess: true, reason: null };
}
