// The hotel's real room numbers. QR codes may only be generated for these — a
// code for a room that doesn't exist would just send a guest to a dead form.
export interface RoomRange {
  start: number
  end: number
}

export const ROOM_RANGES: RoomRange[] = [
  { start: 111, end: 126 },
  { start: 131, end: 142 },
  { start: 211, end: 228 },
  { start: 231, end: 242 },
]

function expand(range: RoomRange): string[] {
  return Array.from({ length: range.end - range.start + 1 }, (_, i) => String(range.start + i))
}

// Human label for a range, e.g. "111–126".
export function rangeLabel(range: RoomRange): string {
  return `${range.start}–${range.end}`
}

// Rooms of one range, in order.
export function roomsInRange(range: RoomRange): string[] {
  return expand(range)
}

// Every allowed room, flattened across all ranges.
export const ALLOWED_ROOMS: string[] = ROOM_RANGES.flatMap(expand)

const ALLOWED_ROOM_SET = new Set(ALLOWED_ROOMS)

export function isAllowedRoom(room: string): boolean {
  return ALLOWED_ROOM_SET.has(room.trim())
}
