import {
  getRequestsCreatedSince, getRequestsAssignedTo, getUnassignedNotifications,
} from '@/services/notification.service'
import type { Role } from '@prisma/client'

export interface StreamCursors {
  newSince: Date
  assignedSince: Date
  unassignedSince: Date
}

export function initialCursors(): StreamCursors {
  const now = new Date()
  return { newSince: now, assignedSince: now, unassignedSince: now }
}

// One poll tick for an open notification stream. Queries run sequentially on
// purpose: the connection pool is capped at 3, and a background poller must not
// take the whole pool away from user-facing requests.
export async function collectNotifications(
  actor: { id: string; role: Role },
  cursors: StreamCursors,
) {
  const created =
    actor.role === 'HOUSEKEEPER' ? [] : await getRequestsCreatedSince(cursors.newSince)
  const assigned = await getRequestsAssignedTo(actor.id, cursors.assignedSince)
  const unassigned = await getUnassignedNotifications(actor.id, cursors.unassignedSince)

  const now = new Date()
  const events: Array<{ event: string; payload: unknown }> = []
  if (created.length > 0) events.push({ event: 'new_requests', payload: created })
  if (assigned.length > 0) events.push({ event: 'assigned_to_you', payload: assigned })
  if (unassigned.length > 0) events.push({ event: 'assigned_to_you', payload: unassigned })

  return {
    events,
    cursors: {
      newSince: created.length > 0 ? now : cursors.newSince,
      assignedSince: assigned.length > 0 ? now : cursors.assignedSince,
      unassignedSince: unassigned.length > 0 ? now : cursors.unassignedSince,
    },
  }
}
