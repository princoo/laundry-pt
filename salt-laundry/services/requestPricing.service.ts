import { prisma } from "@/lib/prisma";
import { getPriceForService, lineKey } from "@/lib/utils/pricing";
import { SERVICE_TYPE_LABELS } from "@/lib/constants/services";
import type { ServiceType } from "@prisma/client";

export { lineKey };

export class RequestValidationError extends Error {}

export interface RequestItemInput {
  laundryItemId: string;
  serviceType: ServiceType;
  quantity: number;
}

// The prices a request is already carrying, taken from its saved lines. Keyed
// by lineKey: quantity is deliberately not part of a line's identity, since
// ordering one more of something already agreed must not re-price it.
export function existingPriceMap(
  lines: readonly {
    laundryItemId: string;
    serviceType: ServiceType;
    unitPrice: number;
  }[],
): Map<string, number> {
  return new Map(
    lines.map((l) => [lineKey(l.laundryItemId, l.serviceType), l.unitPrice]),
  );
}

// Prices every line from the catalogue- client prices are never trusted.
// Shared by creation and every edit path so an order is priced identically
// however it arrives.
//
// `carriedPrices` is how a correction made after the guest committed keeps its
// word: a line already on the request keeps the unit price it was quoted, and
// only genuinely new lines are priced at today's rate. Without it, an admin
// changing the catalogue would silently re-price lines nobody touched.
//
// A carried line skips the catalogue entirely rather than merely overriding the
// price it finds there. That is what lets a request containing a since-
// deactivated item still be corrected- otherwise the lookup below would reject
// the whole edit over a line the editor never touched.
export async function priceRequestItems(
  items: RequestItemInput[],
  carriedPrices?: ReadonlyMap<string, number>,
) {
  const needsLookup = items.filter(
    (item) =>
      carriedPrices?.get(lineKey(item.laundryItemId, item.serviceType)) ===
      undefined,
  );

  const dbItems = await prisma.laundryItem.findMany({
    where: {
      id: { in: needsLookup.map((item) => item.laundryItemId) },
      isActive: true,
    },
  });
  const dbItemsById = new Map(dbItems.map((item) => [item.id, item]));

  return items.map(({ laundryItemId, serviceType, quantity }) => {
    const carried = carriedPrices?.get(lineKey(laundryItemId, serviceType));
    if (carried !== undefined) {
      return {
        laundryItemId,
        serviceType,
        quantity,
        unitPrice: carried,
        subtotal: quantity * carried,
      };
    }

    const dbItem = dbItemsById.get(laundryItemId);
    if (!dbItem)
      throw new RequestValidationError(
        "One of the items is no longer available.",
      );

    // Re-priced per line from that line's own service.
    const unitPrice = getPriceForService(dbItem, serviceType);
    if (unitPrice === null) {
      throw new RequestValidationError(
        `"${dbItem.nameEn}" is not available for ${SERVICE_TYPE_LABELS[serviceType]}`,
      );
    }

    return {
      laundryItemId,
      serviceType,
      quantity,
      unitPrice,
      subtotal: quantity * unitPrice,
    };
  });
}
