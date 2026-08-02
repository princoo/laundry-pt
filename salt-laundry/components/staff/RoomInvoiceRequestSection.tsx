'use client'

import { useState } from 'react'
import { SERVICE_TYPE_LABELS } from '@/lib/constants/services'
import { formatCurrency, formatInvoiceDate } from '@/lib/utils/formatting'
import { InvoiceItemsTable } from '@/components/staff/InvoiceItemsTable'
import type { RoomInvoiceRequest } from '@/lib/hooks/useRoomInvoice'

interface Props {
  request: RoomInvoiceRequest
}

export function RoomInvoiceRequestSection({ request }: Props) {
  const [open, setOpen] = useState(true)

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="print:cursor-default w-full text-left flex justify-between items-center py-2 border-b border-black text-[14px] font-medium"
      >
        <span>
          {formatInvoiceDate(request.createdAt)} — {SERVICE_TYPE_LABELS[request.serviceType]} —{' '}
          {formatCurrency(request.totalAmount)}
        </span>
        <span className="print:hidden text-gray-400">{open ? '−' : '+'}</span>
      </button>
      <div className={`${open ? 'block' : 'hidden'} print:block! mt-2`}>
        <InvoiceItemsTable items={request.items} />
      </div>
    </div>
  )
}
