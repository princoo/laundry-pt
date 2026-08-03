import { NextResponse } from 'next/server'
import { createPasswordResetToken } from '@/services/passwordReset.service'
import { sendPasswordResetEmail } from '@/lib/email'
import { forgotPasswordSchema } from '@/lib/validations/passwordReset.schema'

// Always answers with the same message — never reveal whether an email exists.
const GENERIC_RESPONSE = { message: 'If that email is registered, a reset link has been sent.' }

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = forgotPasswordSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const result = await createPasswordResetToken(parsed.data.email)

  if (result) {
    try {
      await sendPasswordResetEmail({
        to: result.email,
        name: result.name,
        resetToken: result.token,
      })
    } catch (error) {
      // A mail failure must not leak that the address exists — log and move on.
      console.error('Password reset email failed to send', error)
    }
  }

  return NextResponse.json(GENERIC_RESPONSE)
}
