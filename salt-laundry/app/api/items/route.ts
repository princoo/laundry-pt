import { NextResponse } from 'next/server'
import { getActiveItemsWithServices } from '@/services/item.service'

// No `service` query param: the guest form picks service per item, so it needs
// the whole pricing picture in one call.
export async function GET() {
  try {
    const items = await getActiveItemsWithServices()
    return NextResponse.json({ items })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
