import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })

  // Get user session
  const { data: { session } } = await supabase.auth.getSession()
  const path = request.nextUrl.pathname

  // Protect admin routes
  if (path.startsWith('/gohte-architects/admin')) {
    if (!session) {
      const loginUrl = new URL('/gohte-architects/auth/login', request.url)
      loginUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Prevent access to login page when already logged in
  if (path === '/gohte-architects/auth/login') {
    if (session) {
      return NextResponse.redirect(new URL('/gohte-architects/admin', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/gohte-architects/admin/:path*',
    '/gohte-architects/auth/login',
  ],
}