import { GUEST_BASE_URL } from '@/lib/constants/qrCode'

// Each room's QR code points at the form with ?room=<number>. The value lands in
// a field the guest can no longer correct, so anything that isn't a plausible
// room number is dropped and they're asked for it normally instead.
export const MAX_ROOM_LENGTH = 12

export function readRoomParam(param: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(param) ? param[0] : param
  const room = raw?.trim()
  if (!room || room.length > MAX_ROOM_LENGTH) return undefined
  return room
}

// The inverse of readRoomParam — builds the URL a room's QR code encodes. Returns
// null for anything readRoomParam would reject, so the two can never disagree.
export function buildGuestRoomUrl(
  room: string,
  base: string = GUEST_BASE_URL,
): string | null {
  const trimmed = room.trim()
  if (!trimmed || trimmed.length > MAX_ROOM_LENGTH) return null
  return `${base.replace(/\/$/, '')}?room=${encodeURIComponent(trimmed)}`
}
