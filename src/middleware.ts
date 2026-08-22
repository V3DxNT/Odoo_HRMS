import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeMockToken } from '@/lib/mockDb';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Define protected paths
  const isDashboardRoute = pathname.startsWith('/admin') || pathname.startsWith('/employee');
  const isApiRoute = pathname.startsWith('/api') && !pathname.startsWith('/api/auth');

  if (isDashboardRoute || isApiRoute) {
    const token = request.cookies.get('dayflow_session')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }

    const payload = decodeMockToken(token);
    
    if (!payload) {
      // Invalid token, clear it and redirect to auth
      const response = NextResponse.redirect(new URL('/auth', request.url));
      response.cookies.delete('dayflow_session');
      return response;
    }

    // Role-based routing enforcement for dashboard pages
    if (pathname.startsWith('/admin') && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/employee', request.url));
    }
    
    if (pathname.startsWith('/employee') && payload.role !== 'EMPLOYEE') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
