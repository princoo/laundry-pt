import { formatInvoiceDate } from '@/lib/utils/formatting'
import { describeServiceScope, formatBillingPeriod } from '@/lib/utils/invoiceScope'
import { InvoiceField } from '@/components/ui/InvoiceField'
import type { RoomInvoiceFilters } from '@/lib/types/roomInvoice'

interface Props {
  filters: RoomInvoiceFilters
}

export function RoomInvoiceInfoBlock({ filters }: Props) {
  const guest = filters.guestName.trim()

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 text-[14px] pb-6 mb-7 border-b-[0.5px] border-salt-border">
      <InvoiceField label="Room number" value={filters.room} />
      {guest ? <InvoiceField label="Guest" value={guest} /> : null}
      <InvoiceField label="Billing period" value={formatBillingPeriod(filters)} />
      <InvoiceField label="Services included" value={describeServiceScope(filters)} />
      <InvoiceField label="Generated" value={formatInvoiceDate(new Date())} />
    </div>
  )
}
