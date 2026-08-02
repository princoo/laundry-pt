import { NextResponse } from 'next/server'
import { getCurrentUser, requireAuth } from '@/lib/utils/guards'
import { getRequestsQueue } from '@/services/staffRequestQueue.service'
import { processTimeouts } from '@/services/assignment.service'
import { recordDetectedAlerts } from '@/services/requestAlert.service'
import type { RequestStatus } from '@prisma/client'

const VALID_STATUSES: RequestStatus[] = [
  'PENDING', 'COLLECTED', 'IN_PROGRESS', 'READY', 'DELIVERED', 'CANCELLED',
]

export async function GET(request: Request) {
  const authError = await requireAuth()
  if (authError) return authError

  await processTimeouts()
  await recordDetectedAlerts()

  const user = await getCurrentUser()
  const { searchParams } = new URL(request.url)
  const statusParam = searchParams.get('status')
  if (statusParam && !VALID_STATUSES.includes(statusParam as RequestStatus)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const limit = Math.max(1, Number(searchParams.get('limit')) || 20)
  const viewAll = searchParams.get('view') === 'all'
  const assignedToFilter = searchParams.get('assignedTo') ?? undefined

  const { requests, total } = await getRequestsQueue({
    status: statusParam as RequestStatus | undefined,
    page,
    limit,
    actorId: user?.id,
    actorRole: user?.role,
    viewAll,
    assignedToFilter,
  })

  return NextResponse.json({
    requests,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  })
}
