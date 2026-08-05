import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/utils/guards'
import { getAllUsers, createUser, findUserByEmail } from '@/services/user.service'
import { createUserSchema } from '@/lib/validations/user.schema'
import { parsePageParams, buildPageMeta } from '@/lib/utils/pagination'

export async function GET(request: Request) {
  const authError = await requireAdmin()
  if (authError) return authError

  const { searchParams } = new URL(request.url)
  const pageParams = parsePageParams(searchParams)
  const { users, total, activeCount } = await getAllUsers(pageParams)

  return NextResponse.json({ users, activeCount, ...buildPageMeta(total, pageParams) })
}

export async function POST(request: Request) {
  const authError = await requireAdmin()
  if (authError) return authError

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = createUserSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const existing = await findUserByEmail(parsed.data.email)
  if (existing) {
    return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 })
  }

  try {
    const user = await createUser(parsed.data)
    return NextResponse.json(user, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
