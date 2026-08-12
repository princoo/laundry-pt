import { prisma } from '@/lib/prisma'
import { canManageRequest } from '@/lib/utils/requestAccess'
import { formatReference } from '@/lib/utils/formatting'
import { getNotesForRequest } from '@/services/note.service'
import { getAlertEventsForRequest } from '@/services/requestAlert.service'
import { getRequestHistory } from '@/services/requestHistory.service'
import { hasPermission } from '@/lib/utils/permissions'

export const ITEM_DETAIL_SELECT = {
  id: true,
  serviceType: true,
  quantity: true,
  unitPrice: true,
  subtotal: true,
  laundryItem: { select: { nameEn: true, nameFr: true } },
} as const

export async function getRequestById(id: string) {
  return prisma.request.findUnique({
    where: { id },
    include: {
      items: { select: ITEM_DETAIL_SELECT },
      assignedTo: { select: { id: true, name: true } },
      // Staff-only, unlike the public track payload — whoever has to act on a
      // flag needs to see who raised it and why.
      flaggedBy: { select: { id: true, name: true } },
    },
  })
}

// Composes the full request-detail payload, gating notes to whoever may manage
// the request and SLA alert history to whoever sees the whole queue — the
// shape the detail page renders.
export async function getRequestDetailForUser(
  id: string,
  user: { id: string; permissions?: readonly string[] }
) {
  const found = await getRequestById(id)
  if (!found) return null

  const canManage = canManageRequest(found.assignedToId, user)
  const seesWholeQueue = hasPermission(user.permissions, 'LAUNDRY_REQUESTS_VIEW_ALL')
  const notes = canManage ? await getNotesForRequest(id) : []
  const alertEvents = seesWholeQueue ? await getAlertEventsForRequest(id) : undefined
  // Gated with the notes rather than the alert history: it is the same kind of
  // thing — the record of what people did to this request — and it carries
  // prices, so it is not for anyone outside the queue.
  const history = canManage ? await getRequestHistory(id) : undefined

  return {
    ...found,
    reference: formatReference(found.seq, found.createdAt),
    notes,
    canManage,
    ...(alertEvents && { alertEvents }),
    ...(history && { history }),
  }
}
