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
    <table className="w-full text-sm bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm overflow-hidden">
      <thead>
        <tr className="bg-salt-cream text-salt-text-muted text-xs uppercase">
          <th className="py-3 px-4 text-left font-medium">Service type</th>
          <th className="py-3 px-4 text-left font-medium">Requests</th>
          <th className="py-3 px-4 text-left font-medium">Revenue</th>
        </tr>
      </thead>
      <tbody>
        {SERVICE_TYPES.map((type) => (
          <tr key={type} className="border-t border-[0.5px] border-salt-border">
            <td className="py-2.5 px-4">{SERVICE_TYPE_LABELS[type]}</td>
            <td className="py-2.5 px-4">{byServiceType[type].count}</td>
            <td className="py-2.5 px-4">{formatCurrency(byServiceType[type].revenue)}</td>
          </tr>
        ))}
        <tr className="border-t border-[0.5px] border-salt-border text-salt-text-sec">
          <td className="py-2.5 px-4">Express (modifier)</td>
          <td className="py-2.5 px-4">{expressCount}</td>
          <td className="py-2.5 px-4">{formatCurrency(expressRevenue)}</td>
        </tr>
      </tbody>
    </table>
  )
}
