'use client'

import { useRoomInvoice } from '@/lib/hooks/useRoomInvoice'
import { usePermissions } from '@/lib/hooks/usePermissions'
import { RoomInvoiceFilterPanel } from '@/components/staff/RoomInvoiceFilterPanel'
import { RoomInvoiceResult } from '@/components/staff/RoomInvoiceResult'
import { AccessDenied } from '@/components/ui/AccessDenied'

export default function RoomInvoicesPage() {
  const { can, isLoading: isSessionLoading } = usePermissions()
  const { filters, setFilters, applied, data, isLoading, error, search, reset } = useRoomInvoice()

  if (!isSessionLoading && !can('LAUNDRY_REQUESTS_INVOICES_VIEW')) {
    return <AccessDenied />
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 print:max-w-none print:p-0">
      <header className="print:hidden mb-5 sm:mb-6">
        <h1 className="text-[22px] font-black text-salt-text">Room invoice</h1>
        <p className="text-sm text-salt-text-sec mt-1">
          Filter a room&apos;s delivered laundry and generate a printable bill.
        </p>
      </header>

      <div className="grid items-start gap-5 lg:gap-6 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] print:block">
        <RoomInvoiceFilterPanel
          filters={filters}
          onChange={setFilters}
          onSearch={search}
          onReset={reset}
          isLoading={isLoading}
        />

        <div className="min-w-0">
          <RoomInvoiceResult
            applied={applied}
            data={data}
            isLoading={isLoading}
            error={error}
            onRetry={search}
          />
        </div>
      </div>
    </div>
  )
}
