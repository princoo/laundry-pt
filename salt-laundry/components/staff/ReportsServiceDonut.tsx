import { SERVICE_TYPE_LABELS } from '@/lib/constants/services'
import { formatCurrency } from '@/lib/utils/formatting'
import type { ReportServiceStat } from '@/lib/types/report'
import type { ServiceType } from '@prisma/client'

const SEGMENTS: { type: ServiceType; colorClass: string }[] = [
  { type: 'NORMAL', colorClass: 'text-salt-navy' },
  { type: 'DRY_CLEAN', colorClass: 'text-salt-green' },
  { type: 'PRESSING', colorClass: 'text-amber-500' },
]

interface Props {
  byServiceType: Record<ServiceType, ReportServiceStat>
  totalRevenue: number
}

export function ReportsServiceDonut({ byServiceType, totalRevenue }: Props) {
  const percents = SEGMENTS.map((seg) =>
    totalRevenue > 0 ? (byServiceType[seg.type].revenue / totalRevenue) * 100 : 0
  )
  const arcs = SEGMENTS.map((seg, i) => ({
    ...seg,
    percent: percents[i],
    offset: percents.slice(0, i).reduce((a, b) => a + b, 0),
  }))

  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-5 sm:p-6 flex flex-col items-center">
      <h2 className="text-sm font-medium text-salt-text mb-4 self-start">Share of revenue</h2>
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 42 42" className="w-full h-full -rotate-90">
          <circle cx="21" cy="21" r="15.915" fill="none" stroke="currentColor" strokeWidth="6" className="text-salt-border" />
          {arcs.map((arc) => arc.percent > 0 && (
            <circle
              key={arc.type}
              cx="21" cy="21" r="15.915" fill="none"
              stroke="currentColor" strokeWidth="6"
              strokeDasharray={`${arc.percent} ${100 - arc.percent}`}
              strokeDashoffset={-arc.offset}
              className={arc.colorClass}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-center px-2">
          <span className="text-xs font-medium text-salt-text">{formatCurrency(totalRevenue)}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1 mt-4 w-full">
        {SEGMENTS.map((seg) => (
          <div key={seg.type} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-salt-text-sec">
              <span className={`w-2.5 h-2.5 rounded-full bg-current ${seg.colorClass}`} />
              {SERVICE_TYPE_LABELS[seg.type]}
            </span>
            <span className="text-salt-text">{formatCurrency(byServiceType[seg.type].revenue)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
