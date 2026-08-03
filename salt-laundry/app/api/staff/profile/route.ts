import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/utils/guards'
import { getOwnProfile, updateOwnProfile } from '@/services/account.service'
import { updateProfileSchema } from '@/lib/validations/profile.schema'

export async function GET() {
  const current = await getCurrentUser()
  if (!current) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await getOwnProfile(current.id)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  return NextResponse.json({ user })
}

const BAD_REQUEST_ERRORS = new Set([
  'Current password is required',
  'New password must be at least 8 characters',
  'No changes provided',
])

export async function PATCH(request: Request) {
  const current = await getCurrentUser()
  if (!current) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = updateProfileSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  try {
    const user = await updateOwnProfile(current.id, parsed.data)
    return NextResponse.json({ user })
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'WRONG_PASSWORD') {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
    }
    if (message === 'EMAIL_TAKEN') {
      return NextResponse.json({ error: 'That email is already in use.' }, { status: 409 })
    }
    if (BAD_REQUEST_ERRORS.has(message)) {
      return NextResponse.json({ error: message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
