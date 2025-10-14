'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@bitflow/api-client/auth/useAuth';

const PUBLIC_ROUTES = ['/login'];

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, token } = useAuthStore();
  
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname?.startsWith(route));
  
  useEffect(() => {
    // Don't redirect during initial load
    if (isLoading) return;
    
    // If not on a public route and not authenticated, redirect to login
    if (!isPublicRoute && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname || '/dashboard')}`);
    }
    
    // If on login page and authenticated, redirect to dashboard
    if (pathname === '/login' && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, isPublicRoute, pathname, router]);
  
  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/20">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Show loading state while redirecting unauthenticated users
  if (!isPublicRoute && !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/20">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-sm text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}
