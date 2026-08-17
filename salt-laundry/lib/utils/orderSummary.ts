import type { ServiceType } from "@prisma/client";
import { calculateOrder, lineKey } from "@/lib/utils/pricing";
import { lineQuantity } from "@/lib/utils/selections";
import { SERVICE_TYPES } from "@/lib/constants/services";
import type { LaundryItemOption, Selections } from "@/lib/types/guestOrder";

export interface SelectedLine {
  // lineKey, not the item id: an item split across services is two lines, and
  // they have to be tellable apart.
  id: string;
  nameEn: string;
  serviceType: ServiceType;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface ServiceGroup {
  serviceType: ServiceType;
  lines: SelectedLine[];
}

export function buildOrderSummary(
  items: LaundryItemOption[],
  selections: Selections,
  isExpress: boolean,
) {
  // Item order comes from the catalogue and service order from SERVICE_TYPES,
  // so a split item's two lines always list in the same order.
  const selectedLines: SelectedLine[] = items.flatMap((item) =>
    item.services.flatMap((service) => {
      const quantity = lineQuantity(selections, item.id, service.type);
      if (quantity < 1) return [];

      return [
        {
          id: lineKey(item.id, service.type),
          nameEn: item.nameEn,
          serviceType: service.type,
          quantity,
          unitPrice: service.price,
          subtotal: service.price * quantity,
        },
      ];
    }),
  );

  // Express is applied once to the summed gross- it's request-level urgency,
  // not a per-line treatment.
  return { selectedLines, ...calculateOrder(selectedLines, isExpress) };
}

// Summary is grouped by service so a mixed order reads clearly. Iterates
// SERVICE_TYPES so group order is stable, not selection order.
export function groupLinesByService(lines: SelectedLine[]): ServiceGroup[] {
  return SERVICE_TYPES.flatMap((serviceType) => {
    const group = lines.filter((line) => line.serviceType === serviceType);
    return group.length > 0 ? [{ serviceType, lines: group }] : [];
  });
}
