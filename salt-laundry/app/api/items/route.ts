import { NextResponse } from 'next/server'
import { getActiveItemsByService } from '@/services/item.service'
import type { ServiceType } from '@prisma/client'

const VALID_SERVICES = ['NORMAL', 'DRY_CLEAN', 'PRESSING']

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const service = (searchParams.get('service') ?? 'NORMAL').toUpperCase()

  if (!VALID_SERVICES.includes(service)) {
    return NextResponse.json({ error: 'Invalid service type' }, { status: 400 })
  }

  try {
    const items = await getActiveItemsByService(service as ServiceType)
    return NextResponse.json({ items })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
