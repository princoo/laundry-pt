// Each room's QR code points at the form with ?room=<number>. The value lands in
// a field the guest can no longer correct, so anything that isn't a plausible
// room number is dropped and they're asked for it normally instead.
const MAX_ROOM_LENGTH = 12

export function readRoomParam(param: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(param) ? param[0] : param
  const room = raw?.trim()
  if (!room || room.length > MAX_ROOM_LENGTH) return undefined
  return room
}
