import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/utils/guards'
import { getAllItems, createItem } from '@/services/item.service'
import { createItemSchema } from '@/lib/validations/item.schema'

export async function GET() {
  const authError = await requireAdmin()
  if (authError) return authError

  const items = await getAllItems()
  return NextResponse.json({ items })
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

  const parsed = createItemSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  try {
    const item = await createItem(parsed.data)
    return NextResponse.json(item, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
