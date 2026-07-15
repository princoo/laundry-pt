import { VAT_RATE, EXPRESS_RATE } from '@/lib/constants/pricing'

export interface OrderItem {
  quantity: number
  unitPrice: number
}

export function calculateOrder(items: OrderItem[], isExpress: boolean) {
  const itemsGross = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)
  const gross = isExpress ? Math.round(itemsGross * (1 + EXPRESS_RATE)) : itemsGross
  const vat = Math.round(gross * VAT_RATE)
  return { gross, vat, total: gross + vat }
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
