import type { ServiceType } from '@prisma/client'
import { ServiceTypeSelector } from '@/components/guest/ServiceTypeSelector'
import { GuestDetailsForm } from '@/components/guest/GuestDetailsForm'
import { ItemList } from '@/components/guest/ItemList'
import type { LaundryItemOption } from '@/lib/hooks/useItems'

interface Props {
  serviceType: ServiceType
  onServiceTypeChange: (serviceType: ServiceType) => void
  items: LaundryItemOption[]
  quantities: Record<string, number>
  onQuantityChange: (id: string, quantity: number) => void
  isLoading: boolean
  itemsError: string | null
  onRetryItems: () => void
}

export function GuestFormFields({
  serviceType,
  onServiceTypeChange,
  items,
  quantities,
  onQuantityChange,
  isLoading,
  itemsError,
  onRetryItems,
}: Props) {
  return (
    <div className="flex-1 flex flex-col gap-6">
      <ServiceTypeSelector serviceType={serviceType} onChange={onServiceTypeChange} />

      <GuestDetailsForm />

      <ItemList
        items={items}
        quantities={quantities}
        onQuantityChange={onQuantityChange}
        isLoading={isLoading}
        error={itemsError}
        onRetry={onRetryItems}
      />
    </div>
  )
}
