import { z } from "zod";
import { ROOM_RANGES, isAllowedRoom, rangeLabel } from "@/lib/constants/rooms";

const ROOM_HELP = `Rooms run ${ROOM_RANGES.map(rangeLabel).join(", ")}.`;

// The one room-number validator, shared by the guest request form and the track
// page. The hotel's real rooms come from lib/constants/rooms.ts- the same list
// the QR codes and the RoomNumberInput dropdown are built from, so a scanned
// code or a picked room can never fail this.
export const roomNumberSchema = z
  .string()
  .trim()
  .min(1, "Room number is required")
  .refine(isAllowedRoom, `We have no such room. ${ROOM_HELP}`);
