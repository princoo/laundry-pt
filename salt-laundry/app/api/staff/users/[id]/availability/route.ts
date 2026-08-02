import { NextResponse } from 'next/server'
import { requireSupervisor } from '@/lib/utils/guards'
import { setHousekeeperAvailability, AdminAvailabilityError } from '@/services/availability.service'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireSupervisor()
  if (authError) return authError

  const { id } = await params
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { isAvailable } = body as { isAvailable?: unknown }
  if (typeof isAvailable !== 'boolean') {
    return NextResponse.json({ error: 'isAvailable must be a boolean' }, { status: 400 })
  }

  try {
    const result = await setHousekeeperAvailability(id, isAvailable)
    if (!result) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    return NextResponse.json({
      isAvailable: result.isAvailable,
      reassignedCount: result.reassignedCount,
      ...(isAvailable
        ? {}
        : { message: `${result.name} marked as unavailable. ${result.reassignedCount} pending task(s) reassigned.` }),
    })
  } catch (error) {
    if (error instanceof AdminAvailabilityError) {
      return NextResponse.json(
        { error: 'Cannot change availability of an admin account' },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
