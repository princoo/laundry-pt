import { calculateOrder } from '@/lib/utils/pricing'

interface OrderableItem {
  id: string
  nameEn: string
  price: number
}

export function buildOrderSummary(
  items: OrderableItem[],
  quantities: Record<string, number>,
  isExpress: boolean
) {
  const selectedLines = items
    .filter((item) => (quantities[item.id] ?? 0) > 0)
    .map((item) => ({
      id: item.id,
      nameEn: item.nameEn,
      quantity: quantities[item.id],
      subtotal: item.price * quantities[item.id],
    }))

  const orderItems = selectedLines.map((line) => ({
    quantity: line.quantity,
    unitPrice: line.subtotal / line.quantity,
  }))

  return { selectedLines, ...calculateOrder(orderItems, isExpress) }
}
