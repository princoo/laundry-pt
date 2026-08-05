import { NextResponse } from 'next/server'
import { createGuestRequest } from '@/services/request.service'
import { RequestValidationError } from '@/services/requestPricing.service'
import { autoAssign } from '@/services/assignment.service'
import { createGuestRequestSchema } from '@/lib/validations/guestRequest.schema'
import { formatReference } from '@/lib/utils/formatting'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = createGuestRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }
  const { roomNumber, guestName, isExpress, isHanger, note, items } = parsed.data

  try {
    const created = await createGuestRequest({
      roomNumber,
      guestName: guestName || undefined,
      isExpress,
      isHanger,
      note: note || undefined,
      items: items.map(({ laundryItemId, serviceType, quantity }) => ({
        laundryItemId,
        serviceType,
        quantity,
      })),
    })

    try {
      await autoAssign(created.id)
    } catch {
      console.error('Auto-assignment failed for request', created.id)
    }

    return NextResponse.json(
      {
        requestId: created.id,
        reference: formatReference(created.seq, created.createdAt),
        totalAmount: created.totalAmount,
        status: created.status,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof RequestValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
