import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionId = request.cookies.get('session_id')?.value;
  const { pathname } = request.nextUrl;

  // Paths requiring active sessions
  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/creator') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/onboarding');

  if (isProtectedRoute && !sessionId) {
    // Redirect to landing page to sign in if no session exists
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication endpoints)
     * - api/webhook (webhook endpoint)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api/auth|api/webhook|_next/static|_next/image|favicon.ico|uploads).*)',
  ],
};
