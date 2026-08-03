'use client'

import { useState } from 'react'
import { StatBar } from '@/components/staff/StatBar'
import { MyTasksFilterBar } from '@/components/staff/MyTasksFilterBar'
import { RequestCard } from '@/components/staff/RequestCard'
import { EmptyQueue } from '@/components/staff/EmptyQueue'
import { Pagination } from '@/components/ui/Pagination'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { FetchError } from '@/components/ui/FetchError'
import { useQueueControls } from '@/lib/hooks/useQueueControls'
import { useStaffDashboard } from '@/lib/hooks/useStaffDashboard'
import { hasAlert } from '@/lib/utils/sla'

const MY_METRICS = [
  { key: 'pending' as const, label: 'My pending' },
  { key: 'collected' as const, label: 'My collected' },
  { key: 'inProgress' as const, label: 'My in progress' },
  { key: 'ready' as const, label: 'My ready' },
]

export function HousekeeperDashboard() {
  const { status, sort, page, setStatus, setSort, setPage } = useQueueControls()
  const [alertsOnly, setAlertsOnly] = useState(false)
  const { requests, stats, total, totalPages, isLoading, error, lastUpdated, refetch } =
    useStaffDashboard({ status, sort, page })
  const visibleRequests = alertsOnly ? requests.filter(hasAlert) : requests

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5">
      <StatBar
        stats={stats}
        metrics={MY_METRICS}
        requests={requests}
        alertActive={alertsOnly}
        onAlertClick={() => setAlertsOnly((v) => !v)}
      />
      <MyTasksFilterBar
        status={status} onStatusChange={setStatus}
        sort={sort} onSortChange={setSort}
        total={total}
        deliveredToday={stats?.deliveredToday ?? 0} lastUpdated={lastUpdated}
      />

      {isLoading ? (
        <LoadingSkeleton rows={3} height="h-20" rounded="rounded-xl" />
      ) : error ? (
        <FetchError message={error} onRetry={refetch} />
      ) : visibleRequests.length === 0 ? (
        <EmptyQueue filter={status} />
      ) : (
        <>
          {visibleRequests.map((request) => <RequestCard key={request.id} request={request} />)}
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  )
}
