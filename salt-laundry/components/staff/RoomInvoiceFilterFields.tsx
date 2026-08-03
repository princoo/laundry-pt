'use client'

import { Select } from '@/components/ui/Select'
import { LabeledField } from '@/components/ui/LabeledField'
import { QuickRangeChips, type InvoiceRange } from '@/components/staff/QuickRangeChips'
import { INPUT_CLASSES } from '@/lib/constants/formStyles'
import { ALL_TIME_LABEL, EXPRESS_FILTER_OPTIONS } from '@/lib/constants/invoiceFilters'
import { SERVICE_TYPES, SERVICE_TYPE_LABELS } from '@/lib/constants/services'
import { rangeFor, type QuickRange } from '@/lib/utils/dateRange'
import type { ExpressFilter, RoomInvoiceFilters } from '@/lib/types/roomInvoice'
import type { ServiceType } from '@prisma/client'

interface Props {
  filters: RoomInvoiceFilters
  onChange: (filters: RoomInvoiceFilters) => void
}

export function RoomInvoiceFilterFields({ filters, onChange }: Props) {
  const set = <K extends keyof RoomInvoiceFilters>(key: K, value: RoomInvoiceFilters[K]) =>
    onChange({ ...filters, [key]: value })

  const applyRange = (range: InvoiceRange) =>
    onChange({
      ...filters,
      ...(range === ALL_TIME_LABEL ? { from: '', to: '' } : rangeFor(range as QuickRange)),
    })

  return (
    <div className="space-y-4">
      <LabeledField label="Guest name" htmlFor="invoice-guest" hint="optional">
        <input id="invoice-guest" value={filters.guestName} autoComplete="off"
          onChange={(e) => set('guestName', e.target.value)}
          placeholder="Any guest" className={INPUT_CLASSES} />
      </LabeledField>

      <div>
        <LabeledField label="Billing period">
          <QuickRangeChips from={filters.from} to={filters.to} onSelect={applyRange} />
        </LabeledField>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 mt-3">
          <LabeledField label="From" htmlFor="invoice-from">
            <input id="invoice-from" type="date" value={filters.from}
              onChange={(e) => set('from', e.target.value)} className={INPUT_CLASSES} />
          </LabeledField>
          <LabeledField label="To" htmlFor="invoice-to">
            <input id="invoice-to" type="date" value={filters.to}
              onChange={(e) => set('to', e.target.value)} className={INPUT_CLASSES} />
          </LabeledField>
        </div>
      </div>

      <LabeledField label="Service type">
        <Select value={filters.serviceType} onChange={(v) => set('serviceType', v as ServiceType | '')}
          options={[
            { value: '', label: 'All services' },
            ...SERVICE_TYPES.map((s) => ({ value: s, label: SERVICE_TYPE_LABELS[s] })),
          ]} />
      </LabeledField>

      <LabeledField label="Turnaround">
        <Select value={filters.express} onChange={(v) => set('express', v as ExpressFilter)}
          options={EXPRESS_FILTER_OPTIONS} />
      </LabeledField>
    </div>
  )
}
