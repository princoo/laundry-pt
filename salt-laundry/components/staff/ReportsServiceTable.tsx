import { SERVICE_TYPES, SERVICE_TYPE_LABELS } from '@/lib/constants/services'
import { formatCurrency } from '@/lib/utils/formatting'
import type { ReportServiceStat } from '@/lib/types/report'
import type { ServiceType } from '@prisma/client'

interface Props {
  byServiceType: Record<ServiceType, ReportServiceStat>
  expressCount: number
  expressRevenue: number
}

export function ReportsServiceTable({ byServiceType, expressCount, expressRevenue }: Props) {
  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm overflow-hidden">
      <h2 className="text-sm font-medium text-salt-text px-5 pt-4 pb-3">Revenue by service type</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-salt-cream text-salt-text-muted text-xs border-t border-[0.5px] border-salt-border">
            <th className="py-2.5 px-5 text-left font-medium">Service type</th>
            <th className="py-2.5 px-5 text-left font-medium">Volume</th>
            <th className="py-2.5 px-5 text-left font-medium">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {SERVICE_TYPES.map((type) => (
            <tr key={type} className="border-t border-[0.5px] border-salt-border">
              <td className="py-2.5 px-5">{SERVICE_TYPE_LABELS[type]}</td>
              <td className="py-2.5 px-5">{byServiceType[type].count} items</td>
              <td className="py-2.5 px-5">{formatCurrency(byServiceType[type].revenue)}</td>
            </tr>
          ))}
          <tr className="border-t border-[0.5px] border-salt-border text-salt-text-sec">
            <td className="py-2.5 px-5">Express (modifier)</td>
            <td className="py-2.5 px-5">{expressCount} requests</td>
            <td className="py-2.5 px-5">{formatCurrency(expressRevenue)}</td>
          </tr>
        </tbody>
      </table>
      <p className="text-xs text-salt-text-muted px-5 py-3">
        Service rows count items and exclude express and VAT. Express is
        request-level, so its row is the full value of express requests.
      </p>
    </div>
  )
}
