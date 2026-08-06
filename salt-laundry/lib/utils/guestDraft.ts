import type { ServiceType } from '@prisma/client'
import { uniqueServiceTypes } from '@/lib/utils/serviceSummary'
import type {
  GuestOrderDraft, LockedRoom, RequestFormMode, Selections,
} from '@/lib/types/guestOrder'

// The saved request, as the edit endpoint returns it.
export interface EditableRequest {
  roomNumber: string
  guestName: string | null
  note: string | null
  isHanger: boolean
  isExpress: boolean
  items: { laundryItemId: string; serviceType: ServiceType; quantity: number }[]
}

export const EMPTY_DRAFT: GuestOrderDraft = {
  roomNumber: '',
  guestName: '',
  note: '',
  isHanger: false,
  isExpress: false,
  selections: {},
}

// Turns a saved request back into the form's working shape. One line per item —
// the form keys selections by item id, so it can't produce two lines for one item.
export function toGuestOrderDraft(request: EditableRequest): GuestOrderDraft {
  return {
    roomNumber: request.roomNumber,
    guestName: request.guestName ?? '',
    note: request.note ?? '',
    isHanger: request.isHanger,
    isExpress: request.isExpress,
    selections: Object.fromEntries(
      request.items.map(({ laundryItemId, serviceType, quantity }) => [
        laundryItemId,
        { quantity, serviceType },
      ])
    ),
  }
}

// Whether the form shows the room instead of asking for it. An edit is always
// locked — moving a request would hand it to a different guest. A new request is
// locked when the guest came from a room's QR code, which already names the room.
export function resolveLockedRoom(
  mode: RequestFormMode,
  draft: GuestOrderDraft,
  scannedRoom?: string
): LockedRoom | undefined {
  if (mode === 'edit') return { number: draft.roomNumber, reason: 'edit' }
  return scannedRoom ? { number: scannedRoom, reason: 'scan' } : undefined
}

// Where the bulk service control starts. On an order whose lines all agree it
// opens on that service — showing "Normal" over a dry-clean-only order would
// misrepresent it, and one stray click would then wipe the guest's choices.
export function defaultServiceFor(selections: Selections): ServiceType {
  const types = uniqueServiceTypes(Object.values(selections))
  return types.length === 1 ? types[0] : 'NORMAL'
}
