import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })
  
  // Dapatkan session pengguna
  const { data: { session } } = await supabase.auth.getSession()
  const path = request.nextUrl.pathname

  // Proteksi route /gohte-architects/admin
  if (path.startsWith('/gohte-architects/admin')) {
    if (!session) {
      // Redirect ke login dengan mengembalikan URL asal untuk redirect setelah login
      const loginUrl = new URL('/gohte-architects/auth/login', request.url)
      loginUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    // Untuk single user, langsung izinkan akses jika sudah login
  }

  // Proteksi route /gohte-architects/auth/login
  if (path.startsWith('/gohte-architects/auth/login')) {
    if (session) {
      // Redirect ke halaman admin jika sudah login
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