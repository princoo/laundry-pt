import type { ServiceType } from "@prisma/client";
import { calculateOrder } from "@/lib/utils/pricing";
import { getUnitPrice } from "@/lib/utils/selections";
import { SERVICE_TYPES } from "@/lib/constants/services";
import type { LaundryItemOption, Selections } from "@/lib/types/guestOrder";

export interface SelectedLine {
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
  const selectedLines: SelectedLine[] = items.flatMap((item) => {
    const selection = selections[item.id];
    if (!selection || selection.quantity < 1) return [];

    const unitPrice = getUnitPrice(item, selection.serviceType);
    return [
      {
        id: item.id,
        nameEn: item.nameEn,
        serviceType: selection.serviceType,
        quantity: selection.quantity,
        unitPrice,
        subtotal: unitPrice * selection.quantity,
      },
    ];
  });

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
