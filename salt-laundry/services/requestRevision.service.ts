import type { Prisma } from "@prisma/client";

// The line shape stored in RequestRevision.items. Mirrors RequestItem minus its
// id, which is not stable: editing deletes every line and recreates it, so a
// line's durable identity is (laundryItemId, serviceType), not its row id.
export interface RevisionItem {
  laundryItemId: string;
  nameEn: string;
  serviceType: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

// Records what a request looks like *right now*, immediately before an edit
// overwrites it.
//
// Must be called inside the same transaction as the edit, and before it- the
// edit overwrites the totals in place and replaces every line row, so there is
// no later moment at which the previous state can still be read. Sharing the
// transaction also means a rejected edit rolls the snapshot back with it, so a
// revision row can only ever exist for an edit that actually landed.
//
// Returns null when the request is gone, leaving the caller's own not-found
// handling to speak.
export async function snapshotRequest(
  tx: Prisma.TransactionClient,
  requestId: string,
  editedById: string | null,
  reason?: string | null,
) {
  const existing = await tx.request.findUnique({
    where: { id: requestId },
    select: {
      guestName: true,
      note: true,
      isHanger: true,
      isExpress: true,
      grossAmount: true,
      vatAmount: true,
      totalAmount: true,
      items: {
        select: {
          laundryItemId: true,
          serviceType: true,
          quantity: true,
          unitPrice: true,
          subtotal: true,
          // Denormalised on purpose: the snapshot has to stand on its own. An
          // item renamed or deactivated later must not change what this record
          // says the guest ordered.
          laundryItem: { select: { nameEn: true } },
        },
      },
    },
  });
  if (!existing) return null;

  const { items, ...request } = existing;

  return tx.requestRevision.create({
    data: {
      ...request,
      requestId,
      editedById,
      reason: reason ?? null,
      items: items.map(({ laundryItem, ...line }) => ({
        ...line,
        nameEn: laundryItem.nameEn,
      })) as unknown as Prisma.InputJsonValue,
    },
  });
}
