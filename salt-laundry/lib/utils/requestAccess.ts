import type { Role } from '@prisma/client'

interface Actor {
  id?: string
  role?: Role
}

// A housekeeper may only act on requests assigned to them.
// Supervisors and admins may act on any request.
export function canManageRequest(assignedToId: string | null, actor?: Actor): boolean {
  if (!actor?.role) return false
  return actor.role !== 'HOUSEKEEPER' || assignedToId === actor.id
}
