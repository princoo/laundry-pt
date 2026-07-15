'use client'

import { useState } from 'react'
import { StatBar } from '@/components/staff/StatBar'
import { StatusFilter } from '@/components/staff/StatusFilter'
import { QueueMeta } from '@/components/staff/QueueMeta'
import { RequestCard } from '@/components/staff/RequestCard'
import { EmptyQueue } from '@/components/staff/EmptyQueue'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { FetchError } from '@/components/ui/FetchError'
import { useStaffDashboard } from '@/lib/hooks/useStaffDashboard'

export default function StaffDashboardPage() {
  const [activeFilter, setActiveFilter] = useState('ALL')
  const { requests, stats, isLoading, error, lastUpdated, refetch } = useStaffDashboard(activeFilter)

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <StatBar stats={stats} />
      <StatusFilter active={activeFilter} onChange={setActiveFilter} />
      <QueueMeta deliveredToday={stats?.deliveredToday ?? 0} lastUpdated={lastUpdated} />

      {isLoading ? (
        <LoadingSkeleton rows={3} height="h-20" rounded="rounded-xl" />
      ) : error ? (
        <FetchError message={error} onRetry={refetch} />
      ) : requests.length === 0 ? (
        <EmptyQueue filter={activeFilter} />
      ) : (
        requests.map((request) => <RequestCard key={request.id} request={request} />)
      )}
    </div>
  )
}
