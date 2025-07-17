import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Jika user mencoba mengakses halaman admin
  if (request.nextUrl.pathname.startsWith('/gohte-architects/admin')) {
    // Jika tidak ada session, redirect ke halaman login
    if (!session) {
      const redirectUrl = new URL('/gohte-architects/auth/login', request.url)
      // Tambahkan parameter redirect untuk kembali ke halaman yang diminta setelah login
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Jika user sudah login dan mencoba mengakses halaman login
  if (request.nextUrl.pathname === '/gohte-architects/auth/login') {
    if (session) {
      // Cek apakah ada parameter redirect
      const redirectTo = request.nextUrl.searchParams.get('redirect')
      const redirectUrl = redirectTo 
        ? new URL(redirectTo, request.url)
        : new URL('/gohte-architects/admin', request.url)
      
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}