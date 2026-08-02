'use client'

import { useSession } from 'next-auth/react'
import { HousekeeperDashboard } from '@/components/staff/HousekeeperDashboard'
import { SupervisorDashboard } from '@/components/staff/SupervisorDashboard'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'

export default function StaffDashboardPage() {
  const { data: session, status } = useSession()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (session?.user as any)?.role

  if (status === 'loading') {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6">
        <LoadingSkeleton rows={3} height="h-20" rounded="rounded-xl" />
      </div>
    )
  }

  return role === 'HOUSEKEEPER' ? <HousekeeperDashboard /> : <SupervisorDashboard />
}
