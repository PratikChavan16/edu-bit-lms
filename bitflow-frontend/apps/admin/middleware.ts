import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that don't require authentication
const PUBLIC_ROUTES = ['/login'];

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/universities',
  '/feature-toggles',
  '/change-requests',
  '/billing',
  '/invoices',
  '/audit-log',
  '/backups',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the route is public
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));
  
  // Check if the route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  
  // Get auth token from cookies
  const authToken = request.cookies.get('auth-storage')?.value;
  
  let isAuthenticated = false;
  if (authToken) {
    try {
      const authData = JSON.parse(authToken);
      isAuthenticated = authData.state?.isAuthenticated && authData.state?.token;
    } catch (e) {
      // Invalid token format
      isAuthenticated = false;
    }
  }
  
  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Redirect to dashboard if accessing login while authenticated
  if (isPublicRoute && isAuthenticated && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Redirect root to dashboard or login based on auth status
  if (pathname === '/') {
    const redirectUrl = new URL(isAuthenticated ? '/dashboard' : '/login', request.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
};
