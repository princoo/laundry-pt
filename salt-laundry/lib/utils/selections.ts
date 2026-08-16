import type { ServiceType } from "@prisma/client";
import { lineKey } from "@/lib/utils/pricing";
import { SERVICE_TYPE_LABELS } from "@/lib/constants/services";
import type {
  ItemSelection,
  LaundryItemOption,
  Selections,
} from "@/lib/types/guestOrder";

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

// Explains a row that can't be added under the selected service. When the item
// is priced for exactly one service the note names it- that tells the guest
// what to switch to- and only falls back to naming what's missing when the
// item offers several.
export function serviceAvailabilityNote(
  item: LaundryItemOption,
  defaultServiceType: ServiceType,
): string {
  return item.services.length === 1
    ? `${SERVICE_TYPE_LABELS[item.services[0].type]} only`
    : `Not available for ${SERVICE_TYPE_LABELS[defaultServiceType]}`;
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

// The service to price an item at wherever it's listed: the guest's own choice
// once it's in the order, otherwise the service it would enter on.
export function serviceForSelection(
  item: LaundryItemOption,
  selection: ItemSelection | undefined,
  defaultServiceType: ServiceType,
): ServiceType {
  return selection?.serviceType ?? initialServiceFor(item, defaultServiceType);
}

// An item entering the order (0 → 1) seeds its service from the current default.
export function setQuantity(
  selections: Selections,
  item: LaundryItemOption,
  quantity: number,
  defaultServiceType: ServiceType,
): Selections {
  if (quantity <= 0) {
    return Object.fromEntries(
      Object.entries(selections).filter(([id]) => id !== item.id),
    );
  }

  const serviceType =
    selections[item.id]?.serviceType ??
    initialServiceFor(item, defaultServiceType);
  return { ...selections, [item.id]: { quantity, serviceType } };
}

export function setServiceType(
  selections: Selections,
  itemId: string,
  serviceType: ServiceType,
): Selections {
  const existing = selections[itemId];
  if (!existing) return selections;
  return { ...selections, [itemId]: { ...existing, serviceType } };
}

// Changing the default service resets every item already in the order to it,
// discarding per-item overrides- the default is a bulk "set everything to this",
// and individual items can be changed again afterwards.
//
// Items that aren't priced for the new service keep what they have: bouncing a
// dry-clean-only silk blouse to some unrelated third service because the guest
// picked "Pressing" would be a change they never asked for.
export function applyDefaultService(
  selections: Selections,
  items: readonly LaundryItemOption[],
  defaultServiceType: ServiceType,
): Selections {
  const itemsById = new Map(items.map((item) => [item.id, item]));

  return Object.fromEntries(
    Object.entries(selections).map(([id, selection]) => {
      const item = itemsById.get(id);
      const canApply = item && supportsService(item, defaultServiceType);
      return [
        id,
        canApply
          ? { ...selection, serviceType: defaultServiceType }
          : selection,
      ];
    }),
  );
}
