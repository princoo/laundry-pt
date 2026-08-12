import { NextResponse } from 'next/server'
import { requirePermission } from '@/lib/utils/guards'
import { getActiveHousekeepers } from '@/services/user.service'

export async function GET() {
  const authError = await requirePermission('LAUNDRY_HOUSEKEEPERS_VIEW')
  if (authError) return authError

  const housekeepers = await getActiveHousekeepers()
  return NextResponse.json({ housekeepers })
}
