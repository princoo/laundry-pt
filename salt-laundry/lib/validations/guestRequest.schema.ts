import { z } from "zod";
import { SERVICE_TYPES } from "@/lib/constants/services";
import { ROOM_RANGES, isAllowedRoom, rangeLabel } from "@/lib/constants/rooms";

// Letters in any script- the hotel takes guests from everywhere- plus the two
// marks real names carry, an apostrophe and a hyphen, and only ever between
// letters. So "Jean-Pierre", "O'Brien" and "Aimé" pass; "Room 214", "J", "--"
// and anything with a digit or symbol do not.
const NAME_PATTERN = /^\p{L}+(?:[ '’-]\p{L}+)*$/u;

const ROOM_HELP = `Rooms run ${ROOM_RANGES.map(rangeLabel).join(", ")}.`;

export const guestNameSchema = z
  // The message is set here too, so a payload that omits the field entirely
  // answers in the guest's terms rather than with Zod's type mismatch.
  .string({ error: "Please enter your name" })
  .trim()
  .min(2, "Please enter your name")
  .max(60, "That name is too long")
  .regex(NAME_PATTERN, "Letters only- no numbers or symbols");

// The hotel's real rooms, from lib/constants/rooms.ts- the same list the QR
// codes are generated from, so a scanned code can never fail this.
export const roomNumberSchema = z
  .string()
  .trim()
  .min(1, "Room number is required")
  .refine(isAllowedRoom, `We have no such room. ${ROOM_HELP}`);

// Shared by both modes. roomNumber is only loosely checked here because an edit
// cannot change it: the form renders it read-only and editGuestRequestSchema
// drops it entirely. Tightening it here would strand any saved request whose
// room predates this list.
export const guestDetailsSchema = z.object({
  roomNumber: z.string().trim().min(1, "Room number is required"),
  guestName: guestNameSchema,
  note: z.string().trim().optional(),
  isHanger: z.boolean(),
});

// What a new request is held to, on the client form and at POST /api/requests.
export const guestDetailsCreateSchema = guestDetailsSchema.extend({
  roomNumber: roomNumberSchema,
});

export type GuestDetailsValues = z.infer<typeof guestDetailsSchema>;

export const requestItemSchema = z.object({
  laundryItemId: z.string().min(1, "Item is required"),
  serviceType: z.enum(SERVICE_TYPES),
  quantity: z.int().min(1, "Quantity must be at least 1"),
});

// isExpress stays request-level: it's priority return for the whole order,
// not a treatment applied to any one item.
export const createGuestRequestSchema = guestDetailsCreateSchema.extend({
  isExpress: z.boolean(),
  items: z.array(requestItemSchema).min(1, "Select at least one item"),
});

export type CreateGuestRequestInput = z.infer<typeof createGuestRequestSchema>;

// A guest edit carries everything the create payload does except roomNumber:
// changing the room would hand the order to a different guest.
export const editGuestRequestSchema = createGuestRequestSchema.omit({
  roomNumber: true,
});

export type EditGuestRequestInput = z.infer<typeof editGuestRequestSchema>;
