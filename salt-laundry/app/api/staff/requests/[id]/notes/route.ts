import { NextResponse } from 'next/server'
import { getCurrentUser, requirePermission } from '@/lib/utils/guards'
import { getRequestById } from '@/services/staffRequest.service'
import { addNoteToRequest } from '@/services/note.service'
import { createNoteSchema } from '@/lib/validations/note.schema'
import { canManageRequest } from '@/lib/utils/requestAccess'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requirePermission('LAUNDRY_REQUEST_VIEW')
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

  const parsed = createNoteSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const existing = await getRequestById(id)
  if (!existing) return NextResponse.json({ error: 'Request not found' }, { status: 404 })

  if (!canManageRequest(existing.assignedToId, user)) {
    return NextResponse.json(
      { error: 'You can only add notes to requests assigned to you' },
      { status: 403 }
    )
  }

  const note = await addNoteToRequest(id, parsed.data.content, user.id)
  return NextResponse.json(note, { status: 201 })
}
