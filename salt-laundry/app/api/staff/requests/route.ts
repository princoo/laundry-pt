import { NextResponse } from 'next/server'
import { getCurrentUser, requirePermission } from '@/lib/utils/guards'
import { getRequestsQueue } from '@/services/staffRequestQueue.service'
import { recordDetectedAlerts } from '@/services/requestAlert.service'
import { DEFAULT_SORT, type SortOrder } from '@/lib/constants/queue'
import { parsePageParams, buildPageMeta } from '@/lib/utils/pagination'
import type { RequestStatus } from '@prisma/client'

const VALID_STATUSES: RequestStatus[] = [
  'PENDING', 'COLLECTED', 'IN_PROGRESS', 'READY', 'DELIVERED', 'CANCELLED',
]

export async function GET(request: Request) {
  const authError = await requirePermission('LAUNDRY_REQUEST_VIEW')
  if (authError) return authError

  await recordDetectedAlerts()

  const user = await getCurrentUser()
  const { searchParams } = new URL(request.url)
  const statusParam = searchParams.get('status')
  if (statusParam && !VALID_STATUSES.includes(statusParam as RequestStatus)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const pageParams = parsePageParams(searchParams)
  const sort: SortOrder = searchParams.get('sort') === 'asc' ? 'asc' : DEFAULT_SORT
  const assignedToFilter = searchParams.get('assignedTo') ?? undefined

  const { requests, total } = await getRequestsQueue({
    status: statusParam as RequestStatus | undefined,
    ...pageParams,
    sort,
    actorId: user?.id,
    actorPermissions: user?.permissions,
    assignedToFilter,
  })

  return NextResponse.json({ requests, ...buildPageMeta(total, pageParams) })
}
