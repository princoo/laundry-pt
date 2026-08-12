import { formatCurrency } from '@/lib/utils/formatting'
import { SERVICE_TYPE_LABELS } from '@/lib/constants/services'
import type { ServiceType } from '@prisma/client'

// One line as it stood at some point in a request's life. Shape of the JSON
// written by services/requestRevision.service.ts.
export interface HistoryLine {
  laundryItemId: string
  nameEn: string
  serviceType: ServiceType
  quantity: number
  unitPrice: number
  subtotal: number
}

// Everything about a request that an edit can change, at one moment.
export interface HistoryState {
  items: HistoryLine[]
  guestName: string | null
  note: string | null
  isHanger: boolean
  isExpress: boolean
  totalAmount: number
}

export interface LineChange {
  kind: 'added' | 'removed' | 'edited'
  nameEn: string
  // Human-readable statement of what moved, e.g. "3 → 5" or "Normal → Pressing".
  details: string[]
}

export interface FieldChange {
  label: string
  from: string
  to: string
}

export interface RequestChange {
  at: string
  /** Null means the guest, who has no account. */
  editedBy: string | null
  reason: string | null
  lines: LineChange[]
  fields: FieldChange[]
  totalFrom: number
  totalTo: number
}

// A line is identified by its item, not by its row id — editing deletes and
// recreates every row, so ids are meaningless across an edit — and not by
// (item, service) either, because the order form allows only one line per item.
// Keying on the item alone is what lets a service change read as an edit
// rather than as a removal plus an unrelated addition.
const byItem = (lines: HistoryLine[]) => new Map(lines.map((line) => [line.laundryItemId, line]))

const yesNo = (value: boolean) => (value ? 'Yes' : 'No')

function describeLine(before: HistoryLine, after: HistoryLine): string[] {
  const details: string[] = []
  if (before.quantity !== after.quantity) {
    details.push(`Quantity ${before.quantity} → ${after.quantity}`)
  }
  if (before.serviceType !== after.serviceType) {
    details.push(
      `${SERVICE_TYPE_LABELS[before.serviceType]} → ${SERVICE_TYPE_LABELS[after.serviceType]}`
    )
  }
  // Only surfaced when it actually moved. A staff correction deliberately keeps
  // the agreed price, so this line staying silent is the normal case and is
  // itself worth being able to see.
  if (before.unitPrice !== after.unitPrice) {
    details.push(`Unit price ${formatCurrency(before.unitPrice)} → ${formatCurrency(after.unitPrice)}`)
  }
  return details
}

export function diffLines(before: HistoryLine[], after: HistoryLine[]): LineChange[] {
  const beforeByItem = byItem(before)
  const afterByItem = byItem(after)
  const changes: LineChange[] = []

  for (const line of before) {
    const next = afterByItem.get(line.laundryItemId)
    if (!next) {
      changes.push({
        kind: 'removed',
        nameEn: line.nameEn,
        details: [`${line.quantity} × ${SERVICE_TYPE_LABELS[line.serviceType]}`],
      })
      continue
    }
    const details = describeLine(line, next)
    if (details.length > 0) changes.push({ kind: 'edited', nameEn: line.nameEn, details })
  }

  for (const line of after) {
    if (beforeByItem.has(line.laundryItemId)) continue
    changes.push({
      kind: 'added',
      nameEn: line.nameEn,
      details: [`${line.quantity} × ${SERVICE_TYPE_LABELS[line.serviceType]}`],
    })
  }

  return changes
}

export function diffFields(before: HistoryState, after: HistoryState): FieldChange[] {
  const fields: FieldChange[] = []
  if (before.isExpress !== after.isExpress) {
    fields.push({ label: 'Express', from: yesNo(before.isExpress), to: yesNo(after.isExpress) })
  }
  if (before.isHanger !== after.isHanger) {
    fields.push({ label: 'Handling', from: before.isHanger ? 'On hanger' : 'Folded',
      to: after.isHanger ? 'On hanger' : 'Folded' })
  }
  if ((before.guestName ?? '') !== (after.guestName ?? '')) {
    fields.push({ label: 'Name', from: before.guestName || '—', to: after.guestName || '—' })
  }
  if ((before.note ?? '') !== (after.note ?? '')) {
    fields.push({ label: 'Note', from: before.note || '—', to: after.note || '—' })
  }
  return fields
}

// A revision stores the state a request was in *before* the edit that its own
// actor and reason describe. So the change one revision represents is the step
// from its own snapshot to the next one — or, for the most recent revision, to
// the request as it stands now.
//
// Revisions must arrive oldest first.
export function buildHistory(
  revisions: (HistoryState & { createdAt: string; editedBy: string | null; reason: string | null })[],
  current: HistoryState
): RequestChange[] {
  return revisions.map((revision, index) => {
    const after = revisions[index + 1] ?? current
    return {
      at: revision.createdAt,
      editedBy: revision.editedBy,
      reason: revision.reason,
      lines: diffLines(revision.items, after.items),
      fields: diffFields(revision, after),
      totalFrom: revision.totalAmount,
      totalTo: after.totalAmount,
    }
  })
}
