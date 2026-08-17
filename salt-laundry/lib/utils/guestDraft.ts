import type { ServiceType } from "@prisma/client";
import { lineKey } from "@/lib/utils/pricing";
import { uniqueServiceTypes } from "@/lib/utils/serviceSummary";
import { DEFAULT_SERVICE_TYPE } from "@/lib/constants/services";
import type {
  GuestOrderDraft,
  LockedRoom,
  RequestFormMode,
  Selections,
} from "@/lib/types/guestOrder";

// The saved request, as the edit endpoint returns it.
export interface EditableRequest {
  roomNumber: string;
  guestName: string | null;
  note: string | null;
  isHanger: boolean;
  isExpress: boolean;
  items: {
    laundryItemId: string;
    serviceType: ServiceType;
    quantity: number;
  }[];
}

export const EMPTY_DRAFT: GuestOrderDraft = {
  roomNumber: "",
  guestName: "",
  note: "",
  isHanger: false,
  isExpress: false,
  selections: {},
};

// Turns a saved request back into the form's working shape. Saved lines are
// already one per item-and-service, which is exactly how the form keys them, so
// an order split across services reopens split.
export function toGuestOrderDraft(request: EditableRequest): GuestOrderDraft {
  return {
    roomNumber: request.roomNumber,
    guestName: request.guestName ?? "",
    note: request.note ?? "",
    isHanger: request.isHanger,
    isExpress: request.isExpress,
    selections: Object.fromEntries(
      request.items.map((line) => [
        lineKey(line.laundryItemId, line.serviceType),
        line,
      ]),
    ),
  };
}

// Whether the form shows the room instead of asking for it. An edit is always
// locked- moving a request would hand it to a different guest. A new request is
// locked when the guest came from a room's QR code, which already names the room.
export function resolveLockedRoom(
  mode: RequestFormMode,
  draft: GuestOrderDraft,
  scannedRoom?: string,
): LockedRoom | undefined {
  // Staff corrections lock it for the same reason a guest edit does- a
  // correction fixes what was ordered, never whose order it is.
  if (mode === "edit" || mode === "staff-edit") {
    return { number: draft.roomNumber, reason: "edit" };
  }
  return scannedRoom ? { number: scannedRoom, reason: "scan" } : undefined;
}

// Where the default-service control opens. On an order whose lines all agree it
// opens on that service- showing "Normal" over a pressing-only order would
// misrepresent what the guest is looking at. A mixed order has no one service
// to name, so it falls back to the starting default.
export function defaultServiceFor(selections: Selections): ServiceType {
  const types = uniqueServiceTypes(Object.values(selections));
  return types.length === 1 ? types[0] : DEFAULT_SERVICE_TYPE;
}
