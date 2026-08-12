'use client'

import { HousekeeperDashboard } from '@/components/staff/HousekeeperDashboard'
import { SupervisorDashboard } from '@/components/staff/SupervisorDashboard'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { usePermissions } from '@/lib/hooks/usePermissions'

export default function StaffDashboardPage() {
  const { can, isLoading } = usePermissions()

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <LoadingSkeleton rows={3} height="h-20" rounded="rounded-xl" />
      </div>
    )
  }

  // Seeing the whole queue is what makes the supervisor view meaningful;
  // without it there is nothing on screen but your own tasks.
  return can('LAUNDRY_REQUESTS_VIEW_ALL') ? <SupervisorDashboard /> : <HousekeeperDashboard />
}
