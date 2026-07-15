import { NextResponse } from 'next/server'
import { requireStaff } from '@/lib/utils/guards'
import {
  getRequestById,
  updateRequestStatus,
  InvalidStatusTransitionError,
} from '@/services/staffRequest.service'
import { updateStatusSchema } from '@/lib/validations/statusUpdate.schema'
import { formatReference } from '@/lib/utils/formatting'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireStaff()
  if (authError) return authError

  const { id } = await params
  const found = await getRequestById(id)
  if (!found) return NextResponse.json({ error: 'Request not found' }, { status: 404 })

  return NextResponse.json({ ...found, reference: formatReference(found.seq, found.createdAt) })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireStaff()
  if (authError) return authError

  const { id } = await params
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
    const updated = await updateRequestStatus(id, parsed.data.status)
    if (!updated) return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof InvalidStatusTransitionError) {
      return NextResponse.json({ error: 'Invalid status transition' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
