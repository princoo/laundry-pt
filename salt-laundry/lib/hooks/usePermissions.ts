'use client'

import { useSession } from 'next-auth/react'
import { hasPermission } from '@/lib/utils/permissions'
import type { Permission } from '@/lib/constants/permissions'

// Client-side access to the permission list the session carries. `isLoading`
// is exposed so a gate can hold its fire rather than flash an access-denied
// screen while the session resolves.
export function usePermissions() {
  const { data: session, status } = useSession()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const permissions = ((session?.user as any)?.permissions ?? []) as string[]

  return {
    permissions,
    isLoading: status === 'loading',
    can: (permission: Permission) => hasPermission(permissions, permission),
  }
}
