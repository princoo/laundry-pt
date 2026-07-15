import { NextResponse } from 'next/server'
import { requireStaff } from '@/lib/utils/guards'
import { getStaffStats } from '@/services/staffStats.service'

export async function GET() {
  const authError = await requireStaff()
  if (authError) return authError

  const stats = await getStaffStats()
  return NextResponse.json(stats)
}
