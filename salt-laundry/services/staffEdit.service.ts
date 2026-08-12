import { prisma } from "@/lib/prisma";
import { calculateOrder } from "@/lib/utils/pricing";
import { canManageRequest } from "@/lib/utils/requestAccess";
import {
  priceRequestItems,
  existingPriceMap,
  type RequestItemInput,
} from "@/services/requestPricing.service";
import { snapshotRequest } from "@/services/requestRevision.service";
import { ForbiddenRequestAccessError } from "@/services/requestStatus.service";
import {
  FLAG_ELIGIBLE_STATUSES,
  FLAG_LOCKED_REASONS,
} from "@/lib/constants/statuses";

export class StaffRequestNotFoundError extends Error {}
export class StaffRequestNotEditableError extends Error {}

const NOT_FLAGGED =
  "This request has not been flagged for changes, so there is nothing to correct.";
const FLAG_CLEARED_MID_EDIT =
  "Someone resolved this request while you were editing it. Reopen it to see where it stands.";

const STAFF_EDIT_AUDIT_NOTE = "Request corrected by staff.";

interface Actor {
  id: string;
  permissions?: readonly string[];
}

// Room number is absent for the same reason it is absent from the guest edit:
// a correction fixes what was ordered, never who ordered it.
export interface StaffEditInput {
  guestName?: string;
  note?: string;
  isHanger: boolean;
  isExpress: boolean;
  items: RequestItemInput[];
  reason?: string;
}

// Deliberately separate from guestEdit.service.ts rather than a mode on it.
// The two differ in who may act, what makes the request editable, the
// concurrency guard, and the pricing rule- four branches threaded through one
// transaction is how a guest request eventually picks up staff behaviour.
export async function getRequestForStaffEdit(id: string, actor: Actor) {
  const found = await prisma.request.findUnique({
    where: { id },
    select: {
      id: true,
      roomNumber: true,
      guestName: true,
      note: true,
      isHanger: true,
      isExpress: true,
      status: true,
      needsChanges: true,
      flagReason: true,
      assignedToId: true,
      // unitPrice, unlike the guest edit payload, because the form has to
      // preview the prices this correction will actually keep charging.
      items: {
        select: {
          laundryItemId: true,
          serviceType: true,
          quantity: true,
          unitPrice: true,
        },
      },
    },
  });
  if (!found) return null;
  if (!canManageRequest(found.assignedToId, actor))
    throw new ForbiddenRequestAccessError();
  return found;
}

export async function editStaffRequest(
  id: string,
  input: StaffEditInput,
  actor: Actor,
) {
  const existing = await prisma.request.findUnique({
    where: { id },
    select: {
      status: true,
      needsChanges: true,
      assignedToId: true,
      items: {
        select: { laundryItemId: true, serviceType: true, unitPrice: true },
      },
    },
  });
  if (!existing) throw new StaffRequestNotFoundError("Request not found.");
  if (!canManageRequest(existing.assignedToId, actor))
    throw new ForbiddenRequestAccessError();

  if (!FLAG_ELIGIBLE_STATUSES.includes(existing.status)) {
    throw new StaffRequestNotEditableError(
      FLAG_LOCKED_REASONS[existing.status] ??
        "This request can no longer be corrected.",
    );
  }
  // An open flag is what authorises a staff edit at all. Without it there is no
  // record of why the order was changed out from under the guest.
  if (!existing.needsChanges)
    throw new StaffRequestNotEditableError(NOT_FLAGGED);

  // Lines already on the request keep the price the guest agreed to; only new
  // ones are priced from today's catalogue.
  const orderItems = await priceRequestItems(
    input.items,
    existingPriceMap(existing.items),
  );
  const { gross, vat, total } = calculateOrder(orderItems, input.isExpress);

  return prisma.$transaction(async (tx) => {
    // Before anything is overwritten, and inside the transaction so a rejected
    // edit takes the snapshot down with it.
    await snapshotRequest(tx, id, actor.id, input.reason?.trim() || null);

    // The flag is the concurrency token: the guard requires it set and the
    // write clears it, so a second editor arriving behind this one re-reads the
    // committed row, sees needsChanges false and is turned away rather than
    // overwriting a correction they never saw. It catches delivery and
    // cancellation mid-edit in the same step.
    const { count } = await tx.request.updateMany({
      where: { id, needsChanges: true, status: { in: FLAG_ELIGIBLE_STATUSES } },
      data: {
        guestName: input.guestName?.trim() || null,
        note: input.note?.trim() || null,
        isHanger: input.isHanger,
        isExpress: input.isExpress,
        grossAmount: gross,
        vatAmount: vat,
        totalAmount: total,
        // Applying the correction resolves the flag, atomically with it.
        needsChanges: false,
        flaggedAt: null,
        flaggedById: null,
        flagReason: null,
      },
    });
    if (count === 0)
      throw new StaffRequestNotEditableError(FLAG_CLEARED_MID_EDIT);

    await tx.requestItem.deleteMany({ where: { requestId: id } });
    await tx.requestItem.createMany({
      data: orderItems.map((item) => ({ ...item, requestId: id })),
    });
    await tx.requestNote.create({
      data: {
        requestId: id,
        authorId: actor.id,
        content: input.reason?.trim()
          ? `${STAFF_EDIT_AUDIT_NOTE} ${input.reason.trim()}`
          : STAFF_EDIT_AUDIT_NOTE,
      },
    });

    return { requestId: id, totalAmount: total };
  });
}
