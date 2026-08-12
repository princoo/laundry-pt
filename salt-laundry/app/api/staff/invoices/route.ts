import { NextResponse } from 'next/server'
import { requirePermission } from '@/lib/utils/guards'
import { getRoomInvoiceData } from '@/services/invoice.service'
import { roomInvoiceQuerySchema } from '@/lib/validations/roomInvoice.schema'
import { parseHotelDayStart, parseHotelDayEnd } from '@/lib/utils/hotelTime'

export async function GET(request: Request) {
  const authError = await requirePermission('LAUNDRY_REQUESTS_INVOICES_VIEW')
  if (authError) return authError

  const { searchParams } = new URL(request.url)
  const parsed = roomInvoiceQuerySchema.safeParse(Object.fromEntries(searchParams))

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const { room, guestName, serviceType, express, from, to } = parsed.data

  const data = await getRoomInvoiceData({
    room,
    guestName,
    serviceType,
    isExpress: express === 'ALL' ? undefined : express === 'EXPRESS',
    // Hotel time, like the reports endpoint. These parsed in the server's
    // timezone, which is right only while the server happens to run in Kigali.
    from: from ? parseHotelDayStart(from) ?? undefined : undefined,
    to: to ? parseHotelDayEnd(to) ?? undefined : undefined,
  })

  return NextResponse.json(data)
}
