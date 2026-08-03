import { formatCurrency } from '@/lib/utils/formatting'
import type { AdminItemDetail } from '@/lib/hooks/useAdminItemDetail'

interface Props {
  item: AdminItemDetail
}

export function ItemUsageStats({ item }: Props) {
  const stats = [
    { label: 'Times ordered', value: item.timesOrdered },
    { label: 'Units washed', value: item.totalQuantity },
    { label: 'Revenue generated', value: formatCurrency(item.totalRevenue) },
  ]

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-3">
      {stats.map(({ label, value }) => (
        <div key={label} className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-4 text-center">
          <div className="text-2xl font-medium text-salt-navy">{value}</div>
          <div className="text-xs text-salt-text-muted mt-1">{label}</div>
        </div>
      ))}
    </div>
  )
}
