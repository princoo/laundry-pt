import { formatCurrency } from '@/lib/utils/formatting'
import { SERVICE_TYPE_LABELS } from '@/lib/constants/services'
import type { RequestDetail } from '@/lib/types/request'

interface Props {
  request: RequestDetail
}

export function ItemBreakdownCard({ request }: Props) {
  const { items, grossAmount, vatAmount, totalAmount } = request

  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-4 sm:p-6 mt-4">
      <div className="text-[11px] uppercase text-salt-text-muted mb-2">Items</div>

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[520px]">
          <thead>
            <tr className="text-[11px] uppercase text-salt-text-muted border-b border-salt-border">
              <th className="font-normal pb-3">Item</th>
              <th className="font-normal pb-3">Service</th>
              <th className="font-normal pb-3">Qty</th>
              <th className="font-normal pb-3">Unit price</th>
              <th className="font-normal pb-3 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="text-sm border-b  border-salt-border last:border-0">
                <td className="py-3">{item.laundryItem.nameEn}</td>
                <td className="py-3">{SERVICE_TYPE_LABELS[item.serviceType]}</td>
                <td className="py-3">{item.quantity}</td>
                <td className="py-3">{formatCurrency(item.unitPrice)}</td>
                <td className="py-3 text-right">{formatCurrency(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 pt-3 border-t border-salt-border flex flex-col gap-2 text-sm">
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
