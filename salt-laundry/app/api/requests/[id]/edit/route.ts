import { NextResponse } from 'next/server'
import {
  getRequestForEdit,
  editGuestRequest,
  RequestNotFoundError,
  RequestNotEditableError,
} from '@/services/guestEdit.service'
import { RequestValidationError } from '@/services/requestPricing.service'
import { editGuestRequestSchema } from '@/lib/validations/guestRequest.schema'
import { GUEST_EDITABLE_STATUS, EDIT_LOCKED_REASONS } from '@/lib/constants/statuses'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params
  const found = await getRequestForEdit(id)

  if (!found) return NextResponse.json({ error: 'Request not found.' }, { status: 404 })
  if (found.status !== GUEST_EDITABLE_STATUS) {
    return NextResponse.json({ error: EDIT_LOCKED_REASONS[found.status] }, { status: 403 })
  }

  return NextResponse.json({ request: found })
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params

  // ── Guest authorization ──
  // Interim: reaching this endpoint at all means the guest looked the request up
  // by room number, and that is the only credential for now. When the client
  // picks a real guest-auth method — PIN, name match, or device token — the check
  // belongs HERE, before editGuestRequest(), so it stays one contained change.

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = editGuestRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  try {
    return NextResponse.json(await editGuestRequest(id, parsed.data))
  } catch (error) {
    if (error instanceof RequestNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }
    if (error instanceof RequestNotEditableError) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    if (error instanceof RequestValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
