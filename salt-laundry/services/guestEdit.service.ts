import { prisma } from "@/lib/prisma";
import { calculateOrder } from "@/lib/utils/pricing";
import {
  priceRequestItems,
  type RequestItemInput,
} from "@/services/requestPricing.service";
import { snapshotRequest } from "@/services/requestRevision.service";
import {
  GUEST_EDITABLE_STATUS,
  EDIT_LOCKED_REASONS,
  COLLECTED_MID_EDIT,
} from "@/lib/constants/statuses";

export class RequestNotFoundError extends Error {}
export class RequestNotEditableError extends Error {}

const EDIT_AUDIT_NOTE = "Request edited by guest.";

// Room number is deliberately absent: an edit can never move a request to
// another room.
export interface EditRequestInput {
  guestName?: string;
  note?: string;
  isHanger: boolean;
  isExpress: boolean;
  items: RequestItemInput[];
}

// Everything the edit form needs to reopen the request exactly as it stands.
// Prices aren't included- the form rebuilds them from the live catalogue.
export async function getRequestForEdit(id: string) {
  return prisma.request.findUnique({
    where: { id },
    select: {
      id: true,
      roomNumber: true,
      guestName: true,
      note: true,
      isHanger: true,
      isExpress: true,
      status: true,
      items: {
        select: { laundryItemId: true, serviceType: true, quantity: true },
      },
    },
  });
}

export async function editGuestRequest(id: string, input: EditRequestInput) {
  const existing = await prisma.request.findUnique({
    where: { id },
    select: { status: true },
  });
  if (!existing) throw new RequestNotFoundError("Request not found.");
  if (existing.status !== GUEST_EDITABLE_STATUS) {
    throw new RequestNotEditableError(EDIT_LOCKED_REASONS[existing.status]);
  }

  const orderItems = await priceRequestItems(input.items);
  const { gross, vat, total } = calculateOrder(orderItems, input.isExpress);

  return prisma.$transaction(async (tx) => {
    // Before anything is overwritten. A guest has no account, so the edit is
    // recorded against a null author- the same convention RequestNote uses.
    // If the guard below rejects the edit, this rolls back with it.
    await snapshotRequest(tx, id, null);

    // Conditional update: the PENDING check and the write land as one atomic
    // step, so a request collected while the guest was editing can't be
    // overwritten by their now-stale form.
    const { count } = await tx.request.updateMany({
      where: { id, status: GUEST_EDITABLE_STATUS },
      data: {
        guestName: input.guestName?.trim() || null,
        note: input.note?.trim() || null,
        isHanger: input.isHanger,
        isExpress: input.isExpress,
        grossAmount: gross,
        vatAmount: vat,
        totalAmount: total,
        // The guest has now acted on it, so it is no longer awaiting changes.
        // flaggedAt/flagReason are left standing as the record of why it was
        // sent back- only the open flag itself is cleared.
        needsChanges: false,
      },
    });
    if (count === 0) throw new RequestNotEditableError(COLLECTED_MID_EDIT);

    // Lines are replaced wholesale- unitPrice stays a snapshot, just a fresh one.
    await tx.requestItem.deleteMany({ where: { requestId: id } });
    await tx.requestItem.createMany({
      data: orderItems.map((item) => ({ ...item, requestId: id })),
    });
    await tx.requestNote.create({
      data: { requestId: id, content: EDIT_AUDIT_NOTE },
    });

    return { requestId: id, totalAmount: total };
  });
}
