import { prisma } from '@/lib/prisma'
import { getPriceForService } from '@/lib/utils/pricing'
import { SERVICE_TYPE_LABELS } from '@/lib/constants/services'
import type { ServiceType } from '@prisma/client'

export class RequestValidationError extends Error {}

export interface RequestItemInput {
  laundryItemId: string
  serviceType: ServiceType
  quantity: number
}

// Re-prices every line from the catalogue — client prices are never trusted.
// Shared by creation and guest edits so an order is priced identically however
// it arrives.
export async function priceRequestItems(items: RequestItemInput[]) {
  const dbItems = await prisma.laundryItem.findMany({
    where: { id: { in: items.map((item) => item.laundryItemId) }, isActive: true },
  })
  const dbItemsById = new Map(dbItems.map((item) => [item.id, item]))

  return items.map(({ laundryItemId, serviceType, quantity }) => {
    const dbItem = dbItemsById.get(laundryItemId)
    if (!dbItem) throw new RequestValidationError('One of the items is no longer available.')

    // Re-priced per line from that line's own service.
    const unitPrice = getPriceForService(dbItem, serviceType)
    if (unitPrice === null) {
      throw new RequestValidationError(
        `"${dbItem.nameEn}" is not available for ${SERVICE_TYPE_LABELS[serviceType]}`
      )
    }

    return { laundryItemId, serviceType, quantity, unitPrice, subtotal: quantity * unitPrice }
  })
}
