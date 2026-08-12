import { NextResponse } from 'next/server'
import { requirePermission } from '@/lib/utils/guards'
import { getStaffOverview } from '@/services/staffOverview.service'

export async function GET() {
  const authError = await requirePermission('LAUNDRY_HOUSEKEEPERS_VIEW')
  if (authError) return authError

  const overview = await getStaffOverview()
  return NextResponse.json(overview)
}
