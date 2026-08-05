import type { ServiceType } from '@prisma/client'
import { ServiceTypeSelector } from '@/components/guest/ServiceTypeSelector'
import { GuestDetailsForm } from '@/components/guest/GuestDetailsForm'
import { ItemList } from '@/components/guest/ItemList'
import type { LaundryItemOption, Selections } from '@/lib/types/guestOrder'

interface Props {
  defaultServiceType: ServiceType
  onDefaultServiceTypeChange: (serviceType: ServiceType) => void
  items: LaundryItemOption[]
  selections: Selections
  onQuantityChange: (item: LaundryItemOption, quantity: number) => void
  onServiceChange: (itemId: string, serviceType: ServiceType) => void
  isLoading: boolean
  itemsError: string | null
  onRetryItems: () => void
  readOnlyRoom?: string
}

// Section order: details first, then the default service, then items.
export function GuestFormFields({
  defaultServiceType,
  onDefaultServiceTypeChange,
  items,
  selections,
  onQuantityChange,
  onServiceChange,
  isLoading,
  itemsError,
  onRetryItems,
  readOnlyRoom,
}: Props) {
  return (
    <div className="flex-1 flex flex-col gap-6">
      <GuestDetailsForm readOnlyRoom={readOnlyRoom} />

      <ServiceTypeSelector
        serviceType={defaultServiceType}
        onChange={onDefaultServiceTypeChange}
      />

      <ItemList
        items={items}
        selections={selections}
        defaultServiceType={defaultServiceType}
        onQuantityChange={onQuantityChange}
        onServiceChange={onServiceChange}
        isLoading={isLoading}
        error={itemsError}
        onRetry={onRetryItems}
      />
    </div>
  )
}
