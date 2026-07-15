import { formatCurrency } from '@/lib/utils/formatting'
import type { RequestDetail } from '@/lib/types/request'

interface Props {
  request: RequestDetail
}

export function ItemBreakdownCard({ request }: Props) {
  const { items, grossAmount, vatAmount, totalAmount } = request

  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-6 mt-4">
      <div className="text-[11px] uppercase text-salt-text-muted mb-2">Items</div>

      <table className="w-full text-left">
        <thead>
          <tr className="text-[11px] uppercase text-salt-text-muted">
            <th className="font-normal pb-2">Item</th>
            <th className="font-normal pb-2">Qty</th>
            <th className="font-normal pb-2">Unit price</th>
            <th className="font-normal pb-2 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="text-sm border-b border-[0.5px] border-salt-border last:border-0">
              <td className="py-3">{item.laundryItem.nameEn}</td>
              <td className="py-3">{item.quantity}</td>
              <td className="py-3">{formatCurrency(item.unitPrice)}</td>
              <td className="py-3 text-right">{formatCurrency(item.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 pt-4 flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <span>Gross (excl. VAT)</span>
          <span>{formatCurrency(grossAmount)}</span>
        </div>
        <div className="flex justify-between text-salt-text-muted">
          <span>VAT 15%</span>
          <span>{formatCurrency(vatAmount)}</span>
        </div>
        <div className="flex justify-between pt-2 text-[18px] font-medium text-salt-navy">
          <span>Total</span>
          <span>{formatCurrency(totalAmount)}</span>
        </div>
      </div>
    </div>
  )
}
