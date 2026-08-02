import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { Role } from '@prisma/client'

async function getSession() {
  const session = await auth()
  return session
}

// Any authenticated user (HOUSEKEEPER, SUPERVISOR, or ADMIN)
export async function requireAuth() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return null
}

// SUPERVISOR or ADMIN only
export async function requireSupervisor() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const role = (session.user as any).role as Role
  if (role !== 'SUPERVISOR' && role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden — supervisor access required' }, { status: 403 })
  }
  return null
}

// ADMIN only
export async function requireAdmin() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if ((session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden — admin access required' }, { status: 403 })
  }
  return null
}

// Helper: get current user's role from session (use inside route handlers)
export async function getCurrentUser() {
  const session = await getSession()
  if (!session) return null
  return {
    id: (session.user as any).id as string,
    role: (session.user as any).role as Role,
    name: session.user?.name ?? '',
    email: session.user?.email ?? '',
  }
}
