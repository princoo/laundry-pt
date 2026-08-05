import type { ServiceType } from '@prisma/client'
import { formatCurrency } from '@/lib/utils/formatting'
import { SERVICE_TYPE_LABELS } from '@/lib/constants/services'

interface InvoiceLineItem {
  id: string
  serviceType: ServiceType
  quantity: number
  unitPrice: number
  subtotal: number
  laundryItem: { nameEn: string }
}

interface Props {
  items: InvoiceLineItem[]
}

export function InvoiceItemsTable({ items }: Props) {
  return (
    <div className="overflow-x-auto -mx-6 sm:-mx-10 px-6 sm:px-10">
      <table className="w-full min-w-[520px] text-left border-collapse text-[14px]">
        <thead>
          <tr className="text-[11px] uppercase tracking-wide text-salt-text-muted">
            <th className="font-medium border-b-[0.5px] border-salt-border pb-2.5">Item</th>
            <th className="font-medium border-b-[0.5px] border-salt-border pb-2.5">Service</th>
            <th className="font-medium border-b-[0.5px] border-salt-border pb-2.5 text-right">Qty</th>
            <th className="font-medium border-b-[0.5px] border-salt-border pb-2.5 text-right">Unit price</th>
            <th className="font-medium border-b-[0.5px] border-salt-border pb-2.5 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="text-salt-text">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="py-3 border-b-[0.5px] border-salt-border">{item.laundryItem.nameEn}</td>
              <td className="py-3 border-b-[0.5px] border-salt-border">
                {SERVICE_TYPE_LABELS[item.serviceType]}
              </td>
              <td className="py-3 border-b-[0.5px] border-salt-border text-right">{item.quantity}</td>
              <td className="py-3 border-b-[0.5px] border-salt-border text-right">
                {formatCurrency(item.unitPrice)}
              </td>
              <td className="py-3 border-b-[0.5px] border-salt-border text-right">
                {formatCurrency(item.subtotal)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
