import { formatInvoiceDate } from '@/lib/utils/formatting'

interface Props {
  roomNumber: string
}

export function RoomInvoiceInfoBlock({ roomNumber }: Props) {
  return (
    <div className="text-[14px] mb-6 space-y-1">
      <div>
        <span className="text-gray-500">Room:</span>{' '}
        <span className="font-medium">{roomNumber}</span>
      </div>
      <div>
        <span className="text-gray-500">Generated:</span> {formatInvoiceDate(new Date())}
      </div>
    </div>
  )
}
