import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res: response });

  const { data: { user } } = await supabase.auth.getUser();

  // Proteksi rute admin
  if (request.nextUrl.pathname.startsWith('/gohte-architects/admin') && !user) {
    return NextResponse.redirect(new URL('/gohte-architects/auth/login', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/gohte-architects/admin/:path*'],
};