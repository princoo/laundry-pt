'use client'

import { useSession } from 'next-auth/react'
import { AdminAccessDenied } from '@/components/admin/AdminAccessDenied'
import { ReportsPeriodSelector } from '@/components/staff/ReportsPeriodSelector'
import { ReportsSummaryCards } from '@/components/staff/ReportsSummaryCards'
import { ReportsRevenueChart } from '@/components/staff/ReportsRevenueChart'
import { ReportsServiceTable } from '@/components/staff/ReportsServiceTable'
import { ReportsServiceDonut } from '@/components/staff/ReportsServiceDonut'
import { ReportsTopItemsTable } from '@/components/staff/ReportsTopItemsTable'
import { ReportsTopRoomsTable } from '@/components/staff/ReportsTopRoomsTable'
import { ReportsEmptyState } from '@/components/staff/ReportsEmptyState'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { FetchError } from '@/components/ui/FetchError'
import { useReports } from '@/lib/hooks/useReports'

export default function ReportsPage() {
  const { data: session, status } = useSession()
  const { from, setFrom, to, setTo, report, isLoading, error, generate, applyQuickRange } = useReports()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (session?.user as any)?.role

  if (status !== 'loading' && role !== 'ADMIN') {
    return <AdminAccessDenied />
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-[22px] font-black text-salt-text mb-5">Reports</h1>

      <ReportsPeriodSelector
        from={from} to={to}
        onFromChange={setFrom} onToChange={setTo}
        onGenerate={generate} onQuickRange={applyQuickRange}
        isLoading={isLoading}
      />

      <div className="mt-6">
        {isLoading ? (
          <LoadingSkeleton rows={4} height="h-20" rounded="rounded-xl" />
        ) : error ? (
          <FetchError message={error} onRetry={generate} />
        ) : !report || report.summary.requestCount === 0 ? (
          <ReportsEmptyState />
        ) : (
          <div className="flex flex-col gap-6">
            <ReportsSummaryCards
              summary={report.summary}
              expressCount={report.expressCount}
              expressRevenue={report.expressRevenue}
            />

            <ReportsRevenueChart revenueByDay={report.revenueByDay} from={from} to={to} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ReportsServiceTable
                byServiceType={report.byServiceType}
                expressCount={report.expressCount}
                expressRevenue={report.expressRevenue}
              />
              <ReportsServiceDonut
                byServiceType={report.byServiceType}
                totalRevenue={report.summary.totalRevenue}
              />
            </div>

            <ReportsTopItemsTable items={report.topItems} />
            <ReportsTopRoomsTable rooms={report.topRooms} />
          </div>
        )}
      </div>
    </div>
  )
}
