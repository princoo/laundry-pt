import { VAT_RATE, EXPRESS_RATE } from '@/lib/constants/pricing'
import type { ServiceType } from '@prisma/client'

export interface OrderItem {
  quantity: number
  unitPrice: number
}

// A line's identity, shared by the server (which decides what a correction may
// keep charging) and the form (which has to preview the same number). Lives
// here rather than in the pricing service because that one reaches for Prisma
// and cannot be imported into a client component.
export const lineKey = (laundryItemId: string, serviceType: ServiceType) =>
  `${laundryItemId}:${serviceType}`

export function calculateOrder(items: OrderItem[], isExpress: boolean) {
  const itemsGross = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)
  const gross = isExpress ? Math.round(itemsGross * (1 + EXPRESS_RATE)) : itemsGross
  const vat = Math.round(gross * VAT_RATE)
  return { gross, vat, total: gross + vat }
}

// The VAT line's label, read back from the amounts rather than the constant:
// a request priced before a rate change still carries the VAT it was charged,
// and an invoice reprinted today must name that rate, not today's. A live quote
// derives the current rate anyway, since it was just calculated with it.
export function vatLabel(gross: number, vat: number): string {
  const rate = gross > 0 ? vat / gross : VAT_RATE
  return `VAT ${Math.round(rate * 100)}%`
}

export function getPriceForService(
  item: { priceNormal: number | null; priceDryClean: number | null; pricePressing: number | null },
  serviceType: 'NORMAL' | 'DRY_CLEAN' | 'PRESSING'
): number | null {
  const priceByService = {
    NORMAL: item.priceNormal,
    DRY_CLEAN: item.priceDryClean,
    PRESSING: item.pricePressing,
  }
  const price = priceByService[serviceType]
  return price === 0 ? null : price
}
