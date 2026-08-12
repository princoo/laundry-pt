'use client'

import { AccessDenied } from '@/components/ui/AccessDenied'
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
import { usePermissions } from '@/lib/hooks/usePermissions'

export default function ReportsPage() {
  const { can, isLoading: isSessionLoading } = usePermissions()
  const { from, setFrom, to, setTo, report, isLoading, error, generate, applyQuickRange } = useReports()

  // LAUNDRY_REPORTS_EXPORT exists in the permission set but has no surface yet
  // — the PDF button on this page is a later phase, not this one.
  if (!isSessionLoading && !can('LAUNDRY_REPORTS_VIEW')) {
    return <AccessDenied />
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-5 sm:mb-6">
        <h1 className="text-[22px] font-black text-salt-text">Reports</h1>
        <p className="text-sm text-salt-text-sec mt-1">Revenue and activity for the period you choose below.</p>
      </div>

      <ReportsPeriodSelector
        from={from} to={to}
        onFromChange={setFrom} onToChange={setTo}
        onGenerate={generate} onQuickRange={applyQuickRange}
        isLoading={isLoading}
      />

      <div className="mt-6 sm:mt-8">
        {isLoading ? (
          <LoadingSkeleton rows={4} height="h-20" rounded="rounded-xl" />
        ) : error ? (
          <FetchError message={error} onRetry={generate} />
        ) : !report || report.summary.requestCount === 0 ? (
          <ReportsEmptyState />
        ) : (
          <div className="flex flex-col gap-6 sm:gap-8">
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
                serviceRevenue={report.serviceRevenue}
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
