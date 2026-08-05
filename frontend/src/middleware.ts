import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const ref = url.searchParams.get('ref');
  
  const response = NextResponse.next();

  if (ref) {
    // Set cookie for 30 days (30 * 24 * 60 * 60 = 2592000 seconds)
    response.cookies.set('ref', ref, {
      maxAge: 2592000,
      path: '/',
      sameSite: 'lax',
    });
  }

  return response;
}

export const config = {
  // Run on all paths except static assets and api
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
