'use client'

import { useState } from 'react'
import { StatBar } from '@/components/staff/StatBar'
import { QueueMeta } from '@/components/staff/QueueMeta'
import { RequestCard } from '@/components/staff/RequestCard'
import { EmptyQueue } from '@/components/staff/EmptyQueue'
import { HousekeeperTabs } from '@/components/staff/HousekeeperTabs'
import { UnacknowledgedBanner } from '@/components/staff/UnacknowledgedBanner'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { FetchError } from '@/components/ui/FetchError'
import { useStaffDashboard } from '@/lib/hooks/useStaffDashboard'
import { hasAlert } from '@/lib/utils/sla'

const MY_METRICS = [
  { key: 'pending' as const, label: 'My pending' },
  { key: 'collected' as const, label: 'My collected' },
  { key: 'inProgress' as const, label: 'My in progress' },
  { key: 'ready' as const, label: 'My ready' },
]

export function HousekeeperDashboard() {
  const [tab, setTab] = useState<'mine' | 'all'>('mine')
  const [alertsOnly, setAlertsOnly] = useState(false)
  const { requests, stats, isLoading, error, lastUpdated, refetch } =
    useStaffDashboard({ viewAll: tab === 'all' })
  const visibleRequests = alertsOnly ? requests.filter(hasAlert) : requests

  const myCount =
    (stats?.pending ?? 0) + (stats?.collected ?? 0) + (stats?.inProgress ?? 0) + (stats?.ready ?? 0)

  function handleViewUnacknowledged() {
    setTab('mine')
    requestAnimationFrame(() => {
      const target = requests.find((r) => !r.acknowledgedAt && r.status === 'PENDING')
      if (target) {
        document.getElementById(`request-${target.id}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5">
      <StatBar
        stats={stats}
        metrics={MY_METRICS}
        requests={requests}
        alertActive={alertsOnly}
        onAlertClick={() => setAlertsOnly((v) => !v)}
      />
      <UnacknowledgedBanner
        count={stats?.unacknowledged ?? 0}
        onView={handleViewUnacknowledged}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <HousekeeperTabs tab={tab} myCount={myCount} onChange={setTab} />
        <QueueMeta deliveredToday={stats?.deliveredToday ?? 0} lastUpdated={lastUpdated} />
      </div>

      {isLoading ? (
        <LoadingSkeleton rows={3} height="h-20" rounded="rounded-xl" />
      ) : error ? (
        <FetchError message={error} onRetry={refetch} />
      ) : visibleRequests.length === 0 ? (
        <EmptyQueue filter="ALL" />
      ) : (
        visibleRequests.map((request) => <RequestCard key={request.id} request={request} />)
      )}
    </div>
  )
}
