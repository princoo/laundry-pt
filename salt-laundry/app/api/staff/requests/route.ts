import { NextResponse } from 'next/server'
import { requireStaff } from '@/lib/utils/guards'
import { getRequestsQueue } from '@/services/staffRequest.service'
import type { RequestStatus } from '@prisma/client'

const VALID_STATUSES: RequestStatus[] = [
  'PENDING', 'COLLECTED', 'IN_PROGRESS', 'READY', 'DELIVERED', 'CANCELLED',
]

export async function GET(request: Request) {
  const authError = await requireStaff()
  if (authError) return authError

  const { searchParams } = new URL(request.url)
  const statusParam = searchParams.get('status')
  if (statusParam && !VALID_STATUSES.includes(statusParam as RequestStatus)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const limit = Math.max(1, Number(searchParams.get('limit')) || 20)

  const { requests, total } = await getRequestsQueue({
    status: statusParam as RequestStatus | undefined,
    page,
    limit,
  })

  return NextResponse.json({
    requests,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  })
}
