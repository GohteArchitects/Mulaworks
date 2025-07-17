import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  try {
    // Refresh session if expired - required for Server Components
    const {
      data: { session },
      error
    } = await supabase.auth.getSession()

    // Debug log untuk melihat session status
    console.log('Middleware - Path:', request.nextUrl.pathname)
    console.log('Middleware - Session:', session ? 'EXISTS' : 'NULL')
    console.log('Middleware - User:', session?.user?.email || 'NO USER')
    
    if (error) {
      console.log('Middleware - Error:', error)
    }

    // Jika user mencoba mengakses halaman admin
    if (request.nextUrl.pathname.startsWith('/gohte-architects/admin')) {
      // Jika tidak ada session, redirect ke halaman login
      if (!session) {
        console.log('No session, redirecting to login')
        const redirectUrl = new URL('/gohte-architects/auth/login', request.url)
        return NextResponse.redirect(redirectUrl)
      }
      
      // Jika ada session, biarkan akses ke admin
      console.log('Session exists, allowing access to admin')
      return res
    }

    // Jika user sudah login dan mencoba mengakses halaman login
    if (request.nextUrl.pathname === '/gohte-architects/auth/login') {
      if (session) {
        console.log('Session exists, redirecting to admin from login page')
        return NextResponse.redirect(new URL('/gohte-architects/admin', request.url))
      }
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    return res
  }
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