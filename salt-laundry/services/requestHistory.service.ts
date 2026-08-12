import { prisma } from '@/lib/prisma'
import { buildHistory, type HistoryLine, type HistoryState } from '@/lib/utils/requestHistory'

// Reads the edit trail for a request and turns it into "what changed".
//
// Each RequestRevision holds the state before one edit, so the newest revision
// is compared against the request as it stands now — the live row is the final
// entry in the chain, not a separate record. Newest changes first for display.
export async function getRequestHistory(requestId: string) {
  const [revisions, current] = await Promise.all([
    prisma.requestRevision.findMany({
      where: { requestId },
      orderBy: { createdAt: 'asc' },
      include: { editedBy: { select: { name: true } } },
    }),
    prisma.request.findUnique({
      where: { id: requestId },
      select: {
        guestName: true, note: true, isHanger: true, isExpress: true, totalAmount: true,
        items: {
          select: {
            laundryItemId: true, serviceType: true, quantity: true, unitPrice: true, subtotal: true,
            laundryItem: { select: { nameEn: true } },
          },
        },
      },
    }),
  ])

  if (!current || revisions.length === 0) return []

  const currentState: HistoryState = {
    guestName: current.guestName,
    note: current.note,
    isHanger: current.isHanger,
    isExpress: current.isExpress,
    totalAmount: current.totalAmount,
    items: current.items.map(({ laundryItem, ...line }) => ({ ...line, nameEn: laundryItem.nameEn })),
  }

  const snapshots = revisions.map((revision) => ({
    createdAt: revision.createdAt.toISOString(),
    editedBy: revision.editedBy?.name ?? null,
    reason: revision.reason,
    guestName: revision.guestName,
    note: revision.note,
    isHanger: revision.isHanger,
    isExpress: revision.isExpress,
    totalAmount: revision.totalAmount,
    // Written by this app one row at a time and never queried into, so the
    // stored shape is known — see requestRevision.service.ts.
    items: revision.items as unknown as HistoryLine[],
  }))

  return buildHistory(snapshots, currentState).reverse()
}
