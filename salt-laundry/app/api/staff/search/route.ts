import { NextResponse } from 'next/server'
import { requirePermission } from '@/lib/utils/guards'
import { searchRequests } from '@/services/search.service'
import type { RequestStatus, ServiceType } from '@prisma/client'

const VALID_STATUSES: RequestStatus[] = [
  'PENDING', 'COLLECTED', 'IN_PROGRESS', 'READY', 'DELIVERED', 'CANCELLED',
]
const VALID_SERVICES: ServiceType[] = ['NORMAL', 'DRY_CLEAN', 'PRESSING']

export async function GET(request: Request) {
  const authError = await requirePermission('LAUNDRY_REQUESTS_SEARCH')
  if (authError) return authError

  const { searchParams } = new URL(request.url)
  const statusParam = searchParams.get('status')
  const serviceParam = searchParams.get('serviceType')
  const fromParam = searchParams.get('from')
  const toParam = searchParams.get('to')

  if (statusParam && !VALID_STATUSES.includes(statusParam as RequestStatus)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }
  if (serviceParam && !VALID_SERVICES.includes(serviceParam as ServiceType)) {
    return NextResponse.json({ error: 'Invalid service type' }, { status: 400 })
  }

  const from = fromParam ? new Date(fromParam) : undefined
  const to = toParam ? new Date(toParam) : undefined
  if ((from && isNaN(from.getTime())) || (to && isNaN(to.getTime()))) {
    return NextResponse.json({ error: 'Invalid date' }, { status: 400 })
  }

  const { requests, billableTotal } = await searchRequests({
    room: searchParams.get('room') ?? undefined,
    name: searchParams.get('name') ?? undefined,
    status: statusParam as RequestStatus | undefined,
    serviceType: serviceParam as ServiceType | undefined,
    from,
    to,
  })

  return NextResponse.json({ requests, billableTotal, count: requests.length })
}
