'use client'

import type { ServiceType } from '@prisma/client'
import { Select } from '@/components/ui/Select'
import { SERVICE_TYPE_LABELS } from '@/lib/constants/services'
import type { ItemServiceOption } from '@/lib/types/guestOrder'

interface Props {
  services: ItemServiceOption[]
  value: ServiceType
  onChange: (serviceType: ServiceType) => void
}

// Offers only the services this item is priced for. With a single option
// there's nothing to choose, so it reads as a plain label instead.
export function ItemServiceSelect({ services, value, onChange }: Props) {
  if (services.length === 1) {
    return (
      <span className="block text-xs text-salt-text-sec text-right truncate">
        {SERVICE_TYPE_LABELS[services[0].type]}
      </span>
    )
  }

  // The caller sizes the slot and this fills it, so every row's trigger comes out
  // the same width and the popover — which copies the trigger — matches. `py-2`
  // lands the trigger on 33px, the same height as the stepper below it; the
  // tighter `px-2` is what lets "Dry-cleaning" clear the stepper's 120px width.
  return (
    <Select
      value={value}
      onChange={(v) => onChange(v as ServiceType)}
      options={services.map((service) => ({
        value: service.type,
        label: SERVICE_TYPE_LABELS[service.type],
      }))}
      className="px-2! py-2! text-xs!"
    />
  )
}
