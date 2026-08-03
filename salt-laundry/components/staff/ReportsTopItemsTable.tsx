import { formatCurrency } from '@/lib/utils/formatting'
import type { ReportItemStat } from '@/lib/types/report'

interface Props {
  items: ReportItemStat[]
}

export function ReportsTopItemsTable({ items }: Props) {
  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm overflow-hidden">
      <h2 className="text-sm font-medium text-salt-text px-5 pt-4 pb-3">Most laundered items</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-salt-cream text-salt-text-muted text-xs border-t border-[0.5px] border-salt-border">
            <th className="py-2.5 px-5 text-left font-medium">Rank</th>
            <th className="py-2.5 px-5 text-left font-medium">Item</th>
            <th className="py-2.5 px-5 text-left font-medium">Qty washed</th>
            <th className="py-2.5 px-5 text-left font-medium">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={item.name} className={`border-t border-[0.5px] border-salt-border ${i % 2 === 1 ? 'bg-salt-cream/40' : ''}`}>
              <td className="py-2.5 px-5 font-bold text-salt-text">{i + 1}</td>
              <td className="py-2.5 px-5">{item.name}</td>
              <td className="py-2.5 px-5">{item.quantity}</td>
              <td className="py-2.5 px-5">{formatCurrency(item.revenue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
