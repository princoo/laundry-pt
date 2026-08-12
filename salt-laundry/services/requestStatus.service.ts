import { prisma } from "@/lib/prisma";
import {
  STATUS_TRANSITIONS,
  DELIVER_WHILE_FLAGGED,
} from "@/lib/constants/statuses";
import { canManageRequest } from "@/lib/utils/requestAccess";
import { ITEM_DETAIL_SELECT } from "@/services/staffRequest.service";
import type { RequestStatus } from "@prisma/client";

export class InvalidStatusTransitionError extends Error {}
export class ForbiddenRequestAccessError extends Error {}
export class RequestFlaggedError extends Error {}

export async function updateRequestStatus(
  id: string,
  nextStatus: RequestStatus,
  actor: { id: string; permissions?: readonly string[] },
) {
  const existing = await prisma.request.findUnique({ where: { id } });
  if (!existing) return null;

  if (!canManageRequest(existing.assignedToId, actor)) {
    throw new ForbiddenRequestAccessError();
  }

  // The table is the whole rule- CANCELLED included. It already lists
  // CANCELLED as reachable from all four active states, and deliberately not
  // from DELIVERED, whose bill has already been presented to the guest.
  if (!STATUS_TRANSITIONS[existing.status].includes(nextStatus)) {
    throw new InvalidStatusTransitionError();
  }

  // An open flag stops this one transition and no other. The clothes still get
  // washed while the paperwork is being corrected, but delivering is what puts
  // the amount on the guest's room bill and makes it immutable- so a request
  // must not be delivered while its own staff say the order is wrong.
  // CANCELLED stays reachable: cancelling is a legitimate way to resolve a
  // mismatch that cannot be reconciled.
  if (nextStatus === "DELIVERED" && existing.needsChanges) {
    throw new RequestFlaggedError(DELIVER_WHILE_FLAGGED);
  }

  const timestampField =
    nextStatus === "COLLECTED"
      ? "collectedAt"
      : nextStatus === "READY"
        ? "completedAt"
        : nextStatus === "DELIVERED"
          ? "returnedAt"
          : null;

  return prisma.request.update({
    where: { id },
    data: {
      status: nextStatus,
      ...(timestampField ? { [timestampField]: new Date() } : {}),
    },
    include: { items: { select: ITEM_DETAIL_SELECT } },
  });
}
