import { NextResponse } from 'next/server'
import { requirePermission } from '@/lib/utils/guards'
import { getRoomInvoiceData } from '@/services/invoice.service'
import { roomInvoiceQuerySchema } from '@/lib/validations/roomInvoice.schema'

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
    from: from ? new Date(`${from}T00:00:00.000`) : undefined,
    to: to ? new Date(`${to}T23:59:59.999`) : undefined,
  })

  return NextResponse.json(data)
}
