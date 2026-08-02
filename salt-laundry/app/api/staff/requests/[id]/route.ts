import { NextResponse } from 'next/server'
import { getCurrentUser, requireAuth } from '@/lib/utils/guards'
import {
  getRequestDetailForUser,
  updateRequestStatus,
  InvalidStatusTransitionError,
  ForbiddenRequestAccessError,
} from '@/services/staffRequest.service'
import { updateStatusSchema } from '@/lib/validations/statusUpdate.schema'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth()
  if (authError) return authError

  const { id } = await params
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const detail = await getRequestDetailForUser(id, user)
  if (!detail) return NextResponse.json({ error: 'Request not found' }, { status: 404 })

  return NextResponse.json(detail)
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth()
  if (authError) return authError

  const { id } = await params
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = updateStatusSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  try {
    const updated = await updateRequestStatus(id, parsed.data.status, user)
    if (!updated) return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof ForbiddenRequestAccessError) {
      return NextResponse.json(
        { error: 'You can only update requests assigned to you' },
        { status: 403 }
      )
    }
    if (error instanceof InvalidStatusTransitionError) {
      return NextResponse.json({ error: 'Invalid status transition' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
