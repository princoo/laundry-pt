import { NextResponse } from 'next/server'
import { requirePermission } from '@/lib/utils/guards'
import { getActiveHousekeeperById } from '@/services/user.service'
import { assignRequest } from '@/services/assignment.service'
import { getRequestById } from '@/services/staffRequest.service'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requirePermission('LAUNDRY_REQUEST_HOUSEKEEPER_ASSIGN')
  if (authError) return authError

  const { id } = await params
  const { housekeeperId } = await req.json()
  if (!housekeeperId) {
    return NextResponse.json({ error: 'housekeeperId is required' }, { status: 400 })
  }

  const housekeeper = await getActiveHousekeeperById(housekeeperId)
  if (!housekeeper) {
    return NextResponse.json({ error: 'Housekeeper not found' }, { status: 404 })
  }

  try {
    await assignRequest(id, housekeeperId)
  } catch {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 })
  }

  const updated = await getRequestById(id)
  return NextResponse.json(updated)
}
