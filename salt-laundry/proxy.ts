import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export const proxy = auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl
  if (pathname === '/staff/login') {

    if (isLoggedIn) return NextResponse.redirect(new URL('/staff', req.nextUrl))
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
})

export const config = {
  matcher: ['/staff/:path*', '/api/staff/:path*', '/api/admin/:path*'],
}
