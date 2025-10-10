/**
 * Protected Route Component
 * 
 * Wraps pages that require authentication
 * Redirects to login if not authenticated
 * Optionally checks for specific roles
 */

'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../providers/AuthProvider';
import type { UserRole } from '@bitflow/api-client/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth check to complete
    if (isLoading) return;

    // Not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // Check role-based access
    if (allowedRoles && user) {
      if (!allowedRoles.includes(user.role)) {
        // User doesn't have required role, redirect to unauthorized
        router.push('/unauthorized');
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, redirectTo, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Check role-based access
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  // All checks passed, render children
  return <>{children}</>;
}
