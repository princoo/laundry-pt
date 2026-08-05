'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { StatBar } from '@/components/staff/StatBar'
import { QueueFilterBar } from '@/components/staff/QueueFilterBar'
import { RequestCard } from '@/components/staff/RequestCard'
import { EmptyQueue } from '@/components/staff/EmptyQueue'
import { StaffOverviewPanel } from '@/components/staff/StaffOverviewPanel'
import { ReassignModal } from '@/components/staff/ReassignModal'
import { Pagination } from '@/components/ui/Pagination'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { FetchError } from '@/components/ui/FetchError'
import { useStaffDashboard, type QueueRequest } from '@/lib/hooks/useStaffDashboard'
import { usePagedList } from '@/lib/hooks/usePagedList'
import { useClampPage } from '@/lib/hooks/useClampPage'
import { SUPERVISOR_METRICS } from '@/lib/constants/dashboardMetrics'

export function SupervisorDashboard() {
  const { data: session } = useSession()
  const role = (session?.user as any)?.role
  const { page, setPage, withPageReset } = usePagedList()
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [assignedTo, setAssignedTo] = useState<string | undefined>(undefined)
  const [reassignTarget, setReassignTarget] = useState<QueueRequest | null>(null)
  const { requests, stats, totalPages, isLoading, error, lastUpdated, refetch } =
    useStaffDashboard({ status: activeFilter, assignedTo, page })
  useClampPage(page, totalPages, setPage)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5">
      <StatBar stats={stats} metrics={SUPERVISOR_METRICS} />
      <StaffOverviewPanel />
      <QueueFilterBar
        status={activeFilter} onStatusChange={withPageReset(setActiveFilter)}
        assignedTo={assignedTo} onAssignedToChange={withPageReset(setAssignedTo)}
        deliveredToday={stats?.deliveredToday ?? 0} lastUpdated={lastUpdated}
        onRefresh={refetch}
      />

      {isLoading ? (
        <LoadingSkeleton rows={3} height="h-20" rounded="rounded-xl" />
      ) : error ? (
        <FetchError message={error} onRetry={refetch} />
      ) : requests.length === 0 ? (
        <EmptyQueue filter={activeFilter} />
      ) : (
        <>
          {requests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              role={role}
              onReassign={setReassignTarget}
            />
          ))}
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}

      {reassignTarget && (
        <ReassignModal
          requestId={reassignTarget.id}
          currentAssigneeId={reassignTarget.assignedTo?.id ?? null}
          currentAssigneeName={reassignTarget.assignedTo?.name}
          onClose={() => setReassignTarget(null)}
          onReassigned={refetch}
        />
      )}
    </div>
  )
}
