'use client'

import { Inter } from 'next/font/google'
import { useRoomInvoice } from '@/lib/hooks/useRoomInvoice'
import { InvoiceMasthead } from '@/components/staff/InvoiceMasthead'
import { RoomInvoiceSearchForm } from '@/components/staff/RoomInvoiceSearchForm'
import { RoomInvoiceInfoBlock } from '@/components/staff/RoomInvoiceInfoBlock'
import { RoomInvoiceRequestSection } from '@/components/staff/RoomInvoiceRequestSection'
import { RoomInvoiceGrandTotal } from '@/components/staff/RoomInvoiceGrandTotal'
import { PrintButton } from '@/components/ui/PrintButton'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export default function RoomInvoicesPage() {
  const { room, setRoom, roomSearched, data, isLoading, error, search } = useRoomInvoice()

  return (
    <div className={`${inter.variable} font-[family-name:var(--font-inter)] max-w-[680px] mx-auto px-4 py-8 print:px-0`}>
      <RoomInvoiceSearchForm
        room={room}
        onRoomChange={setRoom}
        onSearch={search}
        isLoading={isLoading}
      />

      {error && <p className="print:hidden text-sm text-red-600 mb-6">{error}</p>}

      {data && (
        <div>
          <InvoiceMasthead subtitle="Laundry Billing Summary" />
          <RoomInvoiceInfoBlock roomNumber={roomSearched} />

          {data.requests.length === 0 && (
            <p className="text-sm text-gray-600">
              No delivered laundry requests found for room {roomSearched}.
            </p>
          )}

          {data.requests.map((request) => (
            <RoomInvoiceRequestSection key={request.id} request={request} />
          ))}

          {data.requests.length > 0 && (
            <RoomInvoiceGrandTotal
              count={data.requests.length}
              grossTotal={data.grossTotal}
              vatTotal={data.vatTotal}
              grandTotal={data.grandTotal}
            />
          )}

          <div className="print:hidden mt-8 flex justify-center">
            <PrintButton />
          </div>
        </div>
      )}
    </div>
  )
}
