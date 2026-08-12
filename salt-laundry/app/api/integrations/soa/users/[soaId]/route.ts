import { NextResponse } from 'next/server'
import { requireSoaApiKey } from '@/lib/utils/guards'
import { upsertFromSoa, EmailBelongsToAnotherUserError } from '@/services/soaUser.service'
import { soaUserSchema } from '@/lib/validations/soaUser.schema'

// SOA updates or deactivates a staff account here. Deactivation is
// status: 'INACTIVE' — nothing is deleted, because requests and notes still
// point at the row. Upserts like the POST, so an update to an account the
// laundry never received creates it rather than 404ing SOA into a dead end.
//
// Despite the verb this is a full replace, not a merge: the laundry mirrors
// SOA, and a mirror that keeps a field SOA has cleared is a mirror that lies.
// Sending only the changed fields cannot half-work — email and status are
// required, so a partial payload is a 400 rather than a silent wipe.
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ soaId: string }> }
) {
  const keyError = requireSoaApiKey(request)
  if (keyError) return keyError

  const { soaId } = await params
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const withPathId = { ...(body as Record<string, unknown>), id: soaId }
  if (typeof (body as { id?: unknown })?.id === 'string' && (body as { id: string }).id !== soaId) {
    return NextResponse.json({ error: 'id must match the id in the URL' }, { status: 400 })
  }

  const parsed = soaUserSchema.safeParse(withPathId)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  try {
    const { user } = await upsertFromSoa(parsed.data)
    return NextResponse.json({ user })
  } catch (error) {
    if (error instanceof EmailBelongsToAnotherUserError) {
      return NextResponse.json(
        { error: 'That email address already belongs to a different SOA account' },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
