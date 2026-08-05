import { prisma } from '@/lib/prisma'
import { canManageRequest } from '@/lib/utils/requestAccess'
import { formatReference } from '@/lib/utils/formatting'
import { getNotesForRequest } from '@/services/note.service'
import { getAlertEventsForRequest } from '@/services/requestAlert.service'
import type { Role } from '@prisma/client'

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
    },
  })
}

// Composes the full request-detail payload, gating notes to assignees/managers
// and SLA alert history to supervisors — the shape the detail page renders.
export async function getRequestDetailForUser(id: string, user: { id: string; role: Role }) {
  const found = await getRequestById(id)
  if (!found) return null

  const canManage = canManageRequest(found.assignedToId, user)
  const isSupervisor = user.role === 'SUPERVISOR' || user.role === 'ADMIN'
  const notes = canManage ? await getNotesForRequest(id) : []
  const alertEvents = isSupervisor ? await getAlertEventsForRequest(id) : undefined

  return {
    ...found,
    reference: formatReference(found.seq, found.createdAt),
    notes,
    canManage,
    ...(alertEvents && { alertEvents }),
  }
}
