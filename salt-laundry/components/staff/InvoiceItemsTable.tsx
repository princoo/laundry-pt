import { formatCurrency } from '@/lib/utils/formatting'

interface InvoiceLineItem {
  id: string
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
    <table className="w-full text-left border-collapse text-[14px]">
      <thead>
        <tr>
          <th className="font-medium text-black border-b border-[#e2e0da] py-2.5">Item</th>
          <th className="font-medium text-black border-b border-[#e2e0da] py-2.5">Qty</th>
          <th className="font-medium text-black border-b border-[#e2e0da] py-2.5">Unit price</th>
          <th className="font-medium text-black border-b border-[#e2e0da] py-2.5 text-right">
            Amount
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td className="py-2.5 border-b border-[#e2e0da]">{item.laundryItem.nameEn}</td>
            <td className="py-2.5 border-b border-[#e2e0da]">{item.quantity}</td>
            <td className="py-2.5 border-b border-[#e2e0da]">
              {formatCurrency(item.unitPrice)}
            </td>
            <td className="py-2.5 border-b border-[#e2e0da] text-right">
              {formatCurrency(item.subtotal)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
