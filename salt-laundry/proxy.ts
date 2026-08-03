import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

// Staff pages reachable without a session — sign in and the reset flow.
const PUBLIC_STAFF_PATHS = ['/staff/login', '/staff/forgot-password', '/staff/reset-password']
const CHANGE_PASSWORD_PATH = '/staff/change-password'

export const proxy = auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  if (PUBLIC_STAFF_PATHS.includes(pathname)) {
    if (isLoggedIn && pathname === '/staff/login') {
      return NextResponse.redirect(new URL('/staff', req.nextUrl))
    }
    return NextResponse.next()
  }

  if (!isLoggedIn) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const loginUrl = new URL('/staff/login', req.nextUrl)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Someone on a temporary password gets no staff page but the one that lets
  // them replace it. Gating here rather than in the layout keeps the redirect
  // out of a segment the target page shares — that loops the client router.
  // API routes stay open so the change itself can be submitted.
  const mustChangePassword = (req.auth?.user as any)?.mustChangePassword
  if (mustChangePassword && pathname.startsWith('/staff') && pathname !== CHANGE_PASSWORD_PATH) {
    return NextResponse.redirect(new URL(CHANGE_PASSWORD_PATH, req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/staff/:path*', '/api/staff/:path*', '/api/admin/:path*'],
}
