import { NextResponse } from 'next/server'
import { resetPasswordWithToken } from '@/services/passwordReset.service'
import { resetPasswordSchema } from '@/lib/validations/passwordReset.schema'

const TOKEN_ERRORS: Record<string, string> = {
  INVALID_TOKEN: 'This reset link is invalid.',
  EXPIRED_TOKEN: 'This reset link has expired. Request a new one.',
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = resetPasswordSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  try {
    await resetPasswordWithToken(parsed.data.token, parsed.data.newPassword)
    return NextResponse.json({ message: 'Password updated. You can now sign in.' })
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    const known = TOKEN_ERRORS[message]
    if (known) return NextResponse.json({ error: known, code: message }, { status: 400 })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
