import { NextResponse } from 'next/server'
import { getCurrentUser, requireAuth } from '@/lib/utils/guards'
import { getRequestsQueue } from '@/services/staffRequestQueue.service'
import { recordDetectedAlerts } from '@/services/requestAlert.service'
import { DEFAULT_SORT, QUEUE_PAGE_SIZE, type SortOrder } from '@/lib/constants/queue'
import type { RequestStatus } from '@prisma/client'

const VALID_STATUSES: RequestStatus[] = [
  'PENDING', 'COLLECTED', 'IN_PROGRESS', 'READY', 'DELIVERED', 'CANCELLED',
]

export async function GET(request: Request) {
  const authError = await requireAuth()
  if (authError) return authError

  await recordDetectedAlerts()

  const user = await getCurrentUser()
  const { searchParams } = new URL(request.url)
  const statusParam = searchParams.get('status')
  if (statusParam && !VALID_STATUSES.includes(statusParam as RequestStatus)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const limit = Math.max(1, Number(searchParams.get('limit')) || QUEUE_PAGE_SIZE)
  const sort: SortOrder = searchParams.get('sort') === 'asc' ? 'asc' : DEFAULT_SORT
  const assignedToFilter = searchParams.get('assignedTo') ?? undefined

  const { requests, total } = await getRequestsQueue({
    status: statusParam as RequestStatus | undefined,
    page,
    limit,
    sort,
    actorId: user?.id,
    actorRole: user?.role,
    assignedToFilter,
  })

  return NextResponse.json({
    requests,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  })
}
