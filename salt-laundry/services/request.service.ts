import { prisma } from '@/lib/prisma'
import { calculateOrder } from '@/lib/utils/pricing'
import { priceRequestItems, type RequestItemInput } from '@/services/requestPricing.service'

export interface CreateRequestInput {
  roomNumber: string
  guestName?: string
  isExpress: boolean
  isHanger: boolean
  note?: string
  items: RequestItemInput[]
}

export async function createGuestRequest(input: CreateRequestInput) {
  const orderItems = await priceRequestItems(input.items)
  const { gross, vat, total } = calculateOrder(orderItems, input.isExpress)

  return prisma.$transaction(async (tx) => {
    const request = await tx.request.create({
      data: {
        roomNumber: input.roomNumber,
        guestName: input.guestName,
        isExpress: input.isExpress,
        isHanger: input.isHanger,
        note: input.note,
        grossAmount: gross,
        vatAmount: vat,
        totalAmount: total,
      },
    })

    await tx.requestItem.createMany({
      data: orderItems.map((item) => ({ ...item, requestId: request.id })),
    })

    return request
  })
}
