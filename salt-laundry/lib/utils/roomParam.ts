import { GUEST_BASE_URL } from "@/lib/constants/qrCode";
import { isAllowedRoom } from "@/lib/constants/rooms";

// Each room's QR code points at the form with ?room=<number>. The value lands in
// a field the guest can no longer correct, so it has to be a room the hotel
// actually has- a damaged code, a hand-edited URL or a room that has since been
// renumbered is dropped, and the form asks for the room normally instead.
export const MAX_ROOM_LENGTH = 12;

export function readRoomParam(
  param: string | string[] | undefined,
): string | undefined {
  const raw = Array.isArray(param) ? param[0] : param;
  const room = raw?.trim();
  if (!room || room.length > MAX_ROOM_LENGTH) return undefined;
  return isAllowedRoom(room) ? room : undefined;
}

// The inverse of readRoomParam- builds the URL a room's QR code encodes. Returns
// null for anything readRoomParam would reject, so the two can never disagree:
// a code this refuses to build is one the form would refuse to read.
export function buildGuestRoomUrl(
  room: string,
  base: string = GUEST_BASE_URL,
): string | null {
  const trimmed = room.trim();
  if (!trimmed || trimmed.length > MAX_ROOM_LENGTH) return null;
  if (!isAllowedRoom(trimmed)) return null;
  return `${base.replace(/\/$/, "")}?room=${encodeURIComponent(trimmed)}`;
}
