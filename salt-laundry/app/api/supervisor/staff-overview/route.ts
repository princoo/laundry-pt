import { NextResponse } from 'next/server'
import { requireSupervisor } from '@/lib/utils/guards'
import { getStaffOverview } from '@/services/staffOverview.service'

export async function GET() {
  const authError = await requireSupervisor()
  if (authError) return authError

  const overview = await getStaffOverview()
  return NextResponse.json(overview)
}
