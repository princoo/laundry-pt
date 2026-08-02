import { SERVICE_TYPE_LABELS } from '@/lib/constants/services'
import { formatInvoiceDate, formatTimestamp } from '@/lib/utils/formatting'
import type { ServiceType } from '@prisma/client'

interface Props {
  request: {
    id: string
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
    id, createdAt, serviceType, isExpress, roomNumber,
    guestName, collectedAt, returnedAt,
  } = request

  return (
    <div className="grid grid-cols-2 gap-4 text-[14px] mb-6">
      <div className="space-y-1.5">
        <div><span className="text-gray-500">Invoice date:</span> {formatInvoiceDate(createdAt)}</div>
        <div>
          <span className="text-gray-500">Request ID:</span>{' '}
          <span className="font-mono text-[12px]">{id}</span>
        </div>
        <div>
          <span className="text-gray-500">Service:</span> {SERVICE_TYPE_LABELS[serviceType]}
          {isExpress ? ' + Express' : ''}
        </div>
      </div>
      <div className="space-y-1.5">
        <div><span className="text-gray-500">Room number:</span> <span className="font-medium">{roomNumber}</span></div>
        <div><span className="text-gray-500">Guest name:</span> {guestName ?? '—'}</div>
        <div><span className="text-gray-500">Collected:</span> {collectedAt ? formatTimestamp(collectedAt) : '—'}</div>
        <div><span className="text-gray-500">Returned:</span> {returnedAt ? formatTimestamp(returnedAt) : '—'}</div>
      </div>
    </div>
  )
}
