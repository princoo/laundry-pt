import { createHash, timingSafeEqual } from 'node:crypto'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { hasPermission } from '@/lib/utils/permissions'
import { SOA_API_KEY_HEADER } from '@/lib/constants/integrations'
import type { Permission } from '@/lib/constants/permissions'
import type { Session } from 'next-auth'

function sessionPermissions(session: Session | null): string[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((session?.user as any)?.permissions ?? []) as string[]
}

// The only gate an API route needs. 401 with no session at all, 403 with a
// session that lacks this permission. The page that leads here carries the
// same check — hiding a nav link is not access control.
export async function requirePermission(permission: Permission) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasPermission(sessionPermissions(session), permission)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return null
}

// SOA calls the provisioning endpoints machine to machine, with no session —
// a shared key in a header is the whole gate. Compared over sha256 digests so
// the comparison is both fixed-length and timing-safe: a raw === on the keys
// leaks their length and where they first differ.
export function requireSoaApiKey(request: Request) {
  const expected = process.env.SOA_PROVISION_API_KEY
  if (!expected) {
    return NextResponse.json({ error: 'Provisioning is not configured' }, { status: 500 })
  }

  const presented = request.headers.get(SOA_API_KEY_HEADER) ?? ''
  const digest = (value: string) => createHash('sha256').update(value).digest()
  if (!timingSafeEqual(digest(presented), digest(expected))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}

// The acting user, for services that scope their queries to who is asking.
export async function getCurrentUser() {
  const session = await auth()
  if (!session) return null
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    id: (session.user as any).id as string,
    name: session.user?.name ?? '',
    email: session.user?.email ?? '',
    permissions: sessionPermissions(session),
    // When SOA's token runs out. Long-lived work — the notification stream —
    // reads it so it can end with the session rather than outlive it.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expiresAt: ((session.user as any)?.expiresAt ?? null) as number | null,
  }
}
