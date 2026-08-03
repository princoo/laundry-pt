import { SERVICE_TYPE_LABELS } from '@/lib/constants/services'
import { formatInvoiceDate, formatReference, formatTimestamp } from '@/lib/utils/formatting'
import { InvoiceField } from '@/components/ui/InvoiceField'
import type { ServiceType } from '@prisma/client'

interface Props {
  request: {
    seq: number
    createdAt: Date | string
    serviceType: ServiceType
    isExpress: boolean
    roomNumber: string
    guestName: string | null
    collectedAt: Date | string | null
    returnedAt: Date | string | null
  }
}

export function SingleInvoiceInfoBlock({ request }: Props) {
  const {
    seq, createdAt, serviceType, isExpress, roomNumber,
    guestName, collectedAt, returnedAt,
  } = request

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-[14px] pb-6 mb-6 border-b-[0.5px] border-salt-border">
      <div className="space-y-4">
        <InvoiceField label="Invoice date" value={formatInvoiceDate(createdAt)} />
        <InvoiceField label="Reference" value={formatReference(seq, createdAt)} mono />
        <InvoiceField label="Service" value={`${SERVICE_TYPE_LABELS[serviceType]}${isExpress ? ' + Express' : ''}`} />
      </div>
      <div className="space-y-4">
        <InvoiceField label="Room number" value={roomNumber} />
        <InvoiceField label="Guest name" value={guestName ?? '—'} />
        <InvoiceField label="Collected" value={collectedAt ? formatTimestamp(collectedAt) : '—'} />
        <InvoiceField label="Returned" value={returnedAt ? formatTimestamp(returnedAt) : '—'} />
      </div>
    </div>
  )
}
