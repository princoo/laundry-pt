import { NextResponse } from 'next/server'
import { requirePermission } from '@/lib/utils/guards'
import { setHousekeeperAvailability, NotAHousekeeperError } from '@/services/availability.service'
import { availabilityUpdateSchema } from '@/lib/validations/staffFlags.schema'
import { openTasksWarning } from '@/lib/utils/user'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requirePermission('LAUNDRY_HOUSEKEEPERS_SHIFTS_MANAGE')
  if (authError) return authError

  const { id } = await params
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = availabilityUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  try {
    const result = await setHousekeeperAvailability(id, parsed.data.isAvailable)
    if (!result) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const message = openTasksWarning(result.openTasks, `${result.name} is off shift`)
    return NextResponse.json({ isAvailable: result.isAvailable, ...(message ? { message } : {}) })
  } catch (error) {
    if (error instanceof NotAHousekeeperError) {
      return NextResponse.json(
        { error: 'Only housekeepers have a shift to be on' },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
