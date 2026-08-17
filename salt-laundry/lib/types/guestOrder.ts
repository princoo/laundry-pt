import type { ServiceType } from "@prisma/client";

// One service an item is actually priced for. GET /api/items only ever returns
// services the item has a price for, so a dropdown built from this can't offer
// a combination the server would reject.
export interface ItemServiceOption {
  type: ServiceType;
  price: number;
}

export interface LaundryItemOption {
  id: string;
  nameEn: string;
  nameFr: string;
  services: ItemServiceOption[];
}

// One line of the order: an item under one service. Express is not here- it's
// request-level and lives on the form, not on any line.
export interface SelectionLine {
  laundryItemId: string;
  serviceType: ServiceType;
  quantity: number;
}

// Keyed by lineKey(itemId, serviceType), so one item can be in the order under
// more than one service at once- two shirts washed and one pressed is two
// lines, not a single line that has to pick a service for all three. Only
// entries with quantity > 0 are in the order.
export type Selections = Record<string, SelectionLine>;

// The request form serves three jobs: a guest placing an order, the same guest
// changing one that hasn't been collected yet, and staff correcting one that
// was flagged for changes after collection.
export type RequestFormMode = "create" | "edit" | "staff-edit";

// Why a room is shown rather than asked for: the guest scanned that room's QR
// code, or the request already belongs to a room and no edit may move it.
export type RoomLockReason = "scan" | "edit";

export interface LockedRoom {
  number: string;
  reason: RoomLockReason;
}

// The form's whole working state. In edit mode it's rebuilt from the saved
// request so the form opens exactly as the guest left it.
export interface GuestOrderDraft {
  roomNumber: string;
  guestName: string;
  note: string;
  isHanger: boolean;
  isExpress: boolean;
  selections: Selections;
}
