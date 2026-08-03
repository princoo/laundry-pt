'use client'

import { InvoiceCard } from '@/components/staff/InvoiceCard'
import { InvoiceMasthead } from '@/components/staff/InvoiceMasthead'
import { InvoiceFooter } from '@/components/staff/InvoiceFooter'
import { RoomInvoiceInfoBlock } from '@/components/staff/RoomInvoiceInfoBlock'
import { RoomInvoiceRequestSection } from '@/components/staff/RoomInvoiceRequestSection'
import { RoomInvoiceGrandTotal } from '@/components/staff/RoomInvoiceGrandTotal'
import { RoomInvoiceSummary } from '@/components/staff/RoomInvoiceSummary'
import { SearchStateMessage } from '@/components/staff/SearchStateMessage'
import { FetchError } from '@/components/ui/FetchError'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import type { RoomInvoiceData, RoomInvoiceFilters } from '@/lib/types/roomInvoice'

interface Props {
  applied: RoomInvoiceFilters | null
  data: RoomInvoiceData | null
  isLoading: boolean
  error: string | null
  onRetry: () => void
}

export function RoomInvoiceResult({ applied, data, isLoading, error, onRetry }: Props) {
  if (isLoading) {
    return (
      <div className="print:hidden">
        <LoadingSkeleton rows={3} height="h-24" rounded="rounded-xl" />
      </div>
    )
  }

  if (error) {
    return <div className="print:hidden"><FetchError message={error} onRetry={onRetry} /></div>
  }

  if (!data || !applied) {
    return (
      <div className="print:hidden">
        <SearchStateMessage variant="idle"
          message="Enter a room number, narrow the period if you need to, then generate the invoice." />
      </div>
    )
  }

  if (data.requests.length === 0) {
    return (
      <div className="print:hidden">
        <SearchStateMessage variant="empty"
          message={`No delivered requests for room ${applied.room} match these filters. Widen the billing period or reset the filters.`} />
      </div>
    )
  }

  return (
    <InvoiceCard
      filename={`invoice-room-${applied.room}.pdf`}
      actionsPosition="top"
      summary={
        <RoomInvoiceSummary count={data.requests.length} itemCount={data.itemCount}
          grandTotal={data.grandTotal} />
      }
    >
      <InvoiceMasthead subtitle="Laundry billing summary" />
      <RoomInvoiceInfoBlock filters={applied} />
      {data.requests.map((request) => (
        <RoomInvoiceRequestSection key={request.id} request={request} />
      ))}
      <RoomInvoiceGrandTotal count={data.requests.length} itemCount={data.itemCount}
        grossTotal={data.grossTotal} vatTotal={data.vatTotal} grandTotal={data.grandTotal} />
      <InvoiceFooter />
    </InvoiceCard>
  )
}
