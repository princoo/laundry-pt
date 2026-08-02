import { NextResponse } from 'next/server'
import { getCurrentUser, requireAuth } from '@/lib/utils/guards'
import {
  acknowledgeRequest,
  ForbiddenAssignmentError,
  AlreadyAcknowledgedError,
} from '@/services/acknowledgment.service'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth()
  if (authError) return authError

  const { id } = await params
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const updated = await acknowledgeRequest(id, user.id, user.role)
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof ForbiddenAssignmentError) {
      return NextResponse.json(
        { error: 'This request is not assigned to you' },
        { status: 403 }
      )
    }
    if (error instanceof AlreadyAcknowledgedError) {
      return NextResponse.json({ error: 'Already acknowledged' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
