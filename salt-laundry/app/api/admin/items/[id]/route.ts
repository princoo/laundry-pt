import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/utils/guards'
import { getItemById, updateItem, softDeleteItem } from '@/services/item.service'
import { updateItemSchema } from '@/lib/validations/item.schema'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin()
  if (authError) return authError

  const { id } = await params
  const item = await getItemById(id)
  if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 })
  return NextResponse.json(item)
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin()
  if (authError) return authError

  const { id } = await params
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = updateItemSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  try {
    const updated = await updateItem(id, parsed.data)
    if (!updated) return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin()
  if (authError) return authError

  const { id } = await params
  const deleted = await softDeleteItem(id)
  if (!deleted) return NextResponse.json({ error: 'Item not found' }, { status: 404 })

  return NextResponse.json({ success: true })
}
