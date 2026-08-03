'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { StatBar } from '@/components/staff/StatBar'
import { QueueFilterBar } from '@/components/staff/QueueFilterBar'
import { RequestCard } from '@/components/staff/RequestCard'
import { EmptyQueue } from '@/components/staff/EmptyQueue'
import { StaffOverviewPanel } from '@/components/staff/StaffOverviewPanel'
import { ReassignModal } from '@/components/staff/ReassignModal'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { FetchError } from '@/components/ui/FetchError'
import { useStaffDashboard, type QueueRequest } from '@/lib/hooks/useStaffDashboard'
import { SUPERVISOR_QUEUE_LIMIT } from '@/lib/constants/queue'
import { hasAlert } from '@/lib/utils/sla'

const SUPERVISOR_METRICS = [
  { key: 'pending' as const, label: 'All pending' },
  { key: 'inProgress' as const, label: 'All in progress' },
  { key: 'ready' as const, label: 'All ready' },
  { key: 'unassigned' as const, label: 'Unassigned' },
]

export function SupervisorDashboard() {
  const { data: session } = useSession()
  const role = (session?.user as any)?.role
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [alertsOnly, setAlertsOnly] = useState(false)
  const [assignedTo, setAssignedTo] = useState<string | undefined>(undefined)
  const [reassignTarget, setReassignTarget] = useState<QueueRequest | null>(null)
  const { requests, stats, isLoading, error, lastUpdated, refetch } =
    useStaffDashboard({ status: activeFilter, assignedTo, limit: SUPERVISOR_QUEUE_LIMIT })
  const visibleRequests = alertsOnly ? requests.filter(hasAlert) : requests

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5">
      <StatBar
        stats={stats}
        metrics={SUPERVISOR_METRICS}
        requests={requests}
        alertActive={alertsOnly}
        onAlertClick={() => setAlertsOnly((v) => !v)}
      />
      <StaffOverviewPanel />
      <QueueFilterBar
        status={activeFilter} onStatusChange={setActiveFilter}
        assignedTo={assignedTo} onAssignedToChange={setAssignedTo}
        deliveredToday={stats?.deliveredToday ?? 0} lastUpdated={lastUpdated}
        onRefresh={refetch}
      />

      {isLoading ? (
        <LoadingSkeleton rows={3} height="h-20" rounded="rounded-xl" />
      ) : error ? (
        <FetchError message={error} onRetry={refetch} />
      ) : visibleRequests.length === 0 ? (
        <EmptyQueue filter={activeFilter} />
      ) : (
        visibleRequests.map((request) => (
          <RequestCard
            key={request.id}
            request={request}
            role={role}
            onReassign={setReassignTarget}
          />
        ))
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
