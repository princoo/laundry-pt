import { prisma } from '@/lib/prisma'
import { canManageRequest } from '@/lib/utils/requestAccess'
import { FLAG_ELIGIBLE_STATUSES, FLAG_LOCKED_REASONS } from '@/lib/constants/statuses'
import { ForbiddenRequestAccessError } from '@/services/requestStatus.service'

export class RequestNotFlaggableError extends Error {}

interface Actor {
  id: string
  permissions?: readonly string[]
}

// Flagging a request for changes says "the paperwork does not match the bag".
// It is not a status: the clothes are exactly where they were, and the work on
// them carries on. What it changes is who is expected to act next — the guest
// while the request is still PENDING, staff once it has been collected.
//
// The four columns record the flag that is open right now; the note is the
// durable trail, so a request that has been flagged and resolved twice still
// reads correctly in the staff notes.
export async function flagRequest(id: string, reason: string, actor: Actor) {
  const existing = await prisma.request.findUnique({
    where: { id },
    select: { status: true, assignedToId: true },
  })
  if (!existing) return null

  if (!canManageRequest(existing.assignedToId, actor)) {
    throw new ForbiddenRequestAccessError()
  }
  if (!FLAG_ELIGIBLE_STATUSES.includes(existing.status)) {
    throw new RequestNotFlaggableError(
      FLAG_LOCKED_REASONS[existing.status] ?? 'This request can no longer be flagged for changes.'
    )
  }

  return prisma.$transaction(async (tx) => {
    // Re-checked in the write: a request delivered between the read above and
    // here must not come back flagged.
    const { count } = await tx.request.updateMany({
      where: { id, status: { in: FLAG_ELIGIBLE_STATUSES } },
      data: {
        needsChanges: true,
        flaggedAt: new Date(),
        flaggedById: actor.id,
        flagReason: reason,
      },
    })
    if (count === 0) {
      throw new RequestNotFlaggableError('This request moved on before it could be returned.')
    }

    await tx.requestNote.create({
      data: { requestId: id, authorId: actor.id, content: `Flagged for changes: ${reason}` },
    })

    return { requestId: id }
  })
}

// Withdrawing a flag never touches money, so unlike flagging it has no status
// precondition. That is deliberate: it is the escape hatch for a flag that
// reached a status where flagging itself is no longer allowed.
export async function unflagRequest(id: string, actor: Actor) {
  const existing = await prisma.request.findUnique({
    where: { id },
    select: { assignedToId: true, needsChanges: true },
  })
  if (!existing) return null

  if (!canManageRequest(existing.assignedToId, actor)) {
    throw new ForbiddenRequestAccessError()
  }
  if (!existing.needsChanges) return { requestId: id }

  return prisma.$transaction(async (tx) => {
    await tx.request.update({
      where: { id },
      data: { needsChanges: false, flaggedAt: null, flaggedById: null, flagReason: null },
    })
    await tx.requestNote.create({
      data: {
        requestId: id,
        authorId: actor.id,
        content: 'Changes cleared without an edit.',
      },
    })
    return { requestId: id }
  })
}
