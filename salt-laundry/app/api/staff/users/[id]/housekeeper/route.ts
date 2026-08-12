import { NextResponse } from 'next/server'
import { requirePermission } from '@/lib/utils/guards'
import { setHousekeeperFlag } from '@/services/availability.service'
import { housekeeperUpdateSchema } from '@/lib/validations/staffFlags.schema'
import { openTasksWarning } from '@/lib/utils/user'

// Sits beside the availability route because it is the same screen and the
// same gate: SOA has no permission for the housekeeper flag, so shift
// management carries it.
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

  const parsed = housekeeperUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  try {
    const result = await setHousekeeperFlag(id, parsed.data.isHousekeeper)
    if (!result) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const message = openTasksWarning(
      result.openTasks,
      `${result.name} is no longer a housekeeper`
    )
    return NextResponse.json({
      isHousekeeper: result.isHousekeeper,
      ...(message ? { message } : {}),
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
