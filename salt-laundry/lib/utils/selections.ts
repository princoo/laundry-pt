import type { ServiceType } from "@prisma/client";
import { lineKey } from "@/lib/utils/pricing";
import { SERVICE_TYPE_LABELS } from "@/lib/constants/services";
import type { LaundryItemOption, Selections } from "@/lib/types/guestOrder";

export function getUnitPrice(
  item: LaundryItemOption,
  serviceType: ServiceType,
): number {
  return (
    item.services.find((service) => service.type === serviceType)?.price ?? 0
  );
}

// Rewrites the catalogue a form prices against, so lines a request already
// carries show the price the guest agreed to rather than today's.
//
// Applied once to the item list rather than threaded through every component
// that displays a price: the item row, the search results and the order summary
// all read from this same array, so overriding it here is what keeps the
// previewed total equal to the one the server will save. Lines not carried-
// anything newly added- are left at catalogue price, which is what they will
// actually be charged at.
export function applyCarriedPrices(
  items: LaundryItemOption[],
  carriedPrices?: ReadonlyMap<string, number>,
): LaundryItemOption[] {
  if (!carriedPrices?.size) return items;

  return items.map((item) => ({
    ...item,
    services: item.services.map((service) => {
      const carried = carriedPrices.get(lineKey(item.id, service.type));
      return carried === undefined ? service : { ...service, price: carried };
    }),
  }));
}

export function supportsService(
  item: LaundryItemOption,
  serviceType: ServiceType,
): boolean {
  return item.services.some((service) => service.type === serviceType);
}

// The service an item starts on: the guest's default when the item offers it,
// otherwise the item's only/first available service.
export function initialServiceFor(
  item: LaundryItemOption,
  defaultServiceType: ServiceType,
): ServiceType {
  return supportsService(item, defaultServiceType)
    ? defaultServiceType
    : item.services[0].type;
}

// The note on a row that doesn't enter on the default. The row is still
// orderable- a guest washing most things can add a pressing-only garment to the
// same order- so the note names the service the item rides on, which is also
// what its shown price belongs to. "only" is claimed just when it's true.
export function serviceAvailabilityNote(
  item: LaundryItemOption,
  defaultServiceType: ServiceType,
): string {
  const entering =
    SERVICE_TYPE_LABELS[initialServiceFor(item, defaultServiceType)];
  return item.services.length === 1 ? `${entering} only` : entering;
}

export function lineQuantity(
  selections: Selections,
  laundryItemId: string,
  serviceType: ServiceType,
): number {
  return selections[lineKey(laundryItemId, serviceType)]?.quantity ?? 0;
}

// Everything the guest ordered of one item, however it's split across services.
// This is the number a single count belongs on- the list's item tally, and the
// "already in your order" mark in search.
export function itemQuantity(
  selections: Selections,
  item: LaundryItemOption,
): number {
  return item.services.reduce(
    (sum, service) => sum + lineQuantity(selections, item.id, service.type),
    0,
  );
}

export function setLineQuantity(
  selections: Selections,
  laundryItemId: string,
  serviceType: ServiceType,
  quantity: number,
): Selections {
  const key = lineKey(laundryItemId, serviceType);
  if (quantity <= 0) {
    return Object.fromEntries(
      Object.entries(selections).filter(([k]) => k !== key),
    );
  }
  return { ...selections, [key]: { laundryItemId, serviceType, quantity } };
}

// One more of an item from somewhere that has no service of its own to offer-
// the collapsed row's stepper, or a search result. It lands on the service the
// item would enter on, which is the guest's default whenever the item takes it.
export function addOne(
  selections: Selections,
  item: LaundryItemOption,
  defaultServiceType: ServiceType,
): Selections {
  const serviceType = initialServiceFor(item, defaultServiceType);
  return setLineQuantity(
    selections,
    item.id,
    serviceType,
    lineQuantity(selections, item.id, serviceType) + 1,
  );
}
