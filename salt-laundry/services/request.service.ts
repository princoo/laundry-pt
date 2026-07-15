import { prisma } from '@/lib/prisma'
import { calculateOrder, getPriceForService } from '@/lib/utils/pricing'
import type { ServiceType } from '@prisma/client'

export class RequestValidationError extends Error {}

export interface CreateRequestItemInput {
  laundryItemId: string
  quantity: number
}

export interface CreateRequestInput {
  roomNumber: string
  guestName?: string
  serviceType: ServiceType
  isExpress: boolean
  isHanger: boolean
  note?: string
  items: CreateRequestItemInput[]
}

export async function createGuestRequest(input: CreateRequestInput) {
  const dbItems = await prisma.laundryItem.findMany({
    where: { id: { in: input.items.map(i => i.laundryItemId) }, isActive: true },
  })
  const dbItemsById = new Map(dbItems.map(item => [item.id, item]))

  const orderItems = input.items.map(({ laundryItemId, quantity }) => {
    const dbItem = dbItemsById.get(laundryItemId)
    if (!dbItem) throw new RequestValidationError(`Item not found: ${laundryItemId}`)

    const unitPrice = getPriceForService(dbItem, input.serviceType)
    if (unitPrice === null) {
      throw new RequestValidationError(`"${dbItem.nameEn}" is not available for this service`)
    }

    return { laundryItemId, quantity, unitPrice, subtotal: quantity * unitPrice }
  })

  const { gross, vat, total } = calculateOrder(orderItems, input.isExpress)

  return prisma.$transaction(async (tx) => {
    const request = await tx.request.create({
      data: {
        roomNumber: input.roomNumber,
        guestName: input.guestName,
        serviceType: input.serviceType,
        isExpress: input.isExpress,
        isHanger: input.isHanger,
        note: input.note,
        grossAmount: gross,
        vatAmount: vat,
        totalAmount: total,
      },
    })

    await tx.requestItem.createMany({
      data: orderItems.map(({ laundryItemId, quantity, unitPrice, subtotal }) => ({
        requestId: request.id,
        laundryItemId,
        quantity,
        unitPrice,
        subtotal,
      })),
    })

    return request
  })
}
