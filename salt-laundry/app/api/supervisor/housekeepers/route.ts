import { NextResponse } from 'next/server'
import { requireSupervisor } from '@/lib/utils/guards'
import { getActiveHousekeepers } from '@/services/user.service'

export async function GET() {
  const authError = await requireSupervisor()
  if (authError) return authError

  const housekeepers = await getActiveHousekeepers()
  return NextResponse.json({ housekeepers })
}
