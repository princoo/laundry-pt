import { hasPermission } from '@/lib/utils/permissions'

interface Actor {
  id?: string
  permissions?: readonly string[]
}

// Who may act on a request: anyone who can see the whole queue, or the person
// it is assigned to. Without LAUNDRY_REQUESTS_VIEW_ALL an actor is confined to
// their own tasks.
export function canManageRequest(assignedToId: string | null, actor?: Actor): boolean {
  if (!actor) return false
  if (hasPermission(actor.permissions, 'LAUNDRY_REQUESTS_VIEW_ALL')) return true
  return !!actor.id && assignedToId === actor.id
}
