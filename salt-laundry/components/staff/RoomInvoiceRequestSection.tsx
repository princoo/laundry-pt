import { SERVICE_TYPE_LABELS } from '@/lib/constants/services'
import { formatCurrency, formatInvoiceDate } from '@/lib/utils/formatting'
import { InvoiceItemsTable } from '@/components/staff/InvoiceItemsTable'
import type { RoomInvoiceRequest } from '@/lib/types/roomInvoice'

interface Props {
  request: RoomInvoiceRequest
}

export function RoomInvoiceRequestSection({ request }: Props) {
  return (
    <section className="mb-8 last:mb-0 break-inside-avoid">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5 pb-2.5 border-b-[0.5px] border-salt-border">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[14px] font-medium text-salt-text">
            {formatInvoiceDate(request.createdAt)}
          </span>
          <span className="text-[11px] text-salt-text-sec bg-salt-cream rounded-full px-2 py-0.5">
            {SERVICE_TYPE_LABELS[request.serviceType]}
          </span>
          {request.isExpress && (
            <span className="inline-flex items-center gap-1.5 text-[11px] text-salt-text bg-salt-green-light rounded-full px-2 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-salt-green" aria-hidden="true" />
              Express
            </span>
          )}
        </div>
        <span className="text-[14px] font-medium text-salt-text">
          {formatCurrency(request.totalAmount)}
        </span>
      </div>

      <div className="mt-3">
        <InvoiceItemsTable items={request.items} />
      </div>
    </section>
  )
}
