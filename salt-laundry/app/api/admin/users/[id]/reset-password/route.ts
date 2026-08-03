import { NextResponse } from 'next/server'
import { requireAdmin, getCurrentUser } from '@/lib/utils/guards'
import { adminResetPassword } from '@/services/passwordReset.service'
import { adminResetPasswordSchema } from '@/lib/validations/passwordReset.schema'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdmin()
  if (authError) return authError

  const { id } = await params
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = adminResetPasswordSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const current = await getCurrentUser()
  if (current?.id === id) {
    return NextResponse.json(
      { error: 'Use the profile page to change your own password.' },
      { status: 400 }
    )
  }

  try {
    const target = await adminResetPassword(id, parsed.data.temporaryPassword)
    if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    return NextResponse.json({
      message: 'Password reset. User will be required to change it on next login.',
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
