import { NextResponse } from 'next/server'
import { getCurrentUser, requirePermission } from '@/lib/utils/guards'
import { getStaffStats } from '@/services/staffStats.service'

export async function GET() {
  const authError = await requirePermission('LAUNDRY_REQUEST_VIEW')
  if (authError) return authError

  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const stats = await getStaffStats(user)
  return NextResponse.json(stats)
}
