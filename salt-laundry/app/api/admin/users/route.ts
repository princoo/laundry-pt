import { NextResponse } from 'next/server'
import { requirePermission } from '@/lib/utils/guards'
import { getAllUsers } from '@/services/user.service'
import { parsePageParams, buildPageMeta } from '@/lib/utils/pagination'

// Read only. SOA owns creating, editing and deactivating accounts — the
// laundry receives them through app/api/integrations/soa/users.
export async function GET(request: Request) {
  const authError = await requirePermission('LAUNDRY_HOUSEKEEPERS_VIEW')
  if (authError) return authError

  const { searchParams } = new URL(request.url)
  const pageParams = parsePageParams(searchParams)
  const { users, total, activeCount } = await getAllUsers(pageParams)

  return NextResponse.json({ users, activeCount, ...buildPageMeta(total, pageParams) })
}
