'use client'

import { StatBar } from '@/components/staff/StatBar'
import { MyTasksFilterBar } from '@/components/staff/MyTasksFilterBar'
import { RequestCard } from '@/components/staff/RequestCard'
import { EmptyQueue } from '@/components/staff/EmptyQueue'
import { Pagination } from '@/components/ui/Pagination'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { FetchError } from '@/components/ui/FetchError'
import { useQueueControls } from '@/lib/hooks/useQueueControls'
import { useClampPage } from '@/lib/hooks/useClampPage'
import { useStaffDashboard } from '@/lib/hooks/useStaffDashboard'
import { MY_METRICS } from '@/lib/constants/dashboardMetrics'

export function HousekeeperDashboard() {
  const { status, sort, page, setStatus, setSort, setPage } = useQueueControls()
  const { requests, stats, total, totalPages, isLoading, error, lastUpdated, refetch } =
    useStaffDashboard({ status, sort, page })
  useClampPage(page, totalPages, setPage)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5">
      <StatBar stats={stats} metrics={MY_METRICS} />
      <MyTasksFilterBar
        status={status} onStatusChange={setStatus}
        sort={sort} onSortChange={setSort}
        total={total}
        deliveredToday={stats?.deliveredToday ?? 0} lastUpdated={lastUpdated}
        onRefresh={refetch}
      />

      {isLoading ? (
        <LoadingSkeleton rows={3} height="h-20" rounded="rounded-xl" />
      ) : error ? (
        <FetchError message={error} onRetry={refetch} />
      ) : requests.length === 0 ? (
        <EmptyQueue filter={status} hint="Tasks appear here once a supervisor assigns them to you." />
      ) : (
        <>
          {requests.map((request) => (
            <RequestCard key={request.id} request={request} isMyTask />
          ))}
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  )
}
