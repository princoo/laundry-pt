import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/utils/guards'
import { getRoomInvoiceData } from '@/services/search.service'

export async function GET(request: Request) {
  const authError = await requireAuth()
  if (authError) return authError

  const { searchParams } = new URL(request.url)
  const room = searchParams.get('room')?.trim()

  if (!room) {
    return NextResponse.json({ error: 'Room number is required' }, { status: 400 })
  }

  const data = await getRoomInvoiceData(room)
  return NextResponse.json(data)
}
