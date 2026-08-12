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

// The guest's choice for one item. Service is per item; express is not here-
// it's request-level and lives on the form, not on any line.
export interface ItemSelection {
  quantity: number;
  serviceType: ServiceType;
}

// Keyed by item id. Only entries with quantity > 0 are in the order.
export type Selections = Record<string, ItemSelection>;

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
