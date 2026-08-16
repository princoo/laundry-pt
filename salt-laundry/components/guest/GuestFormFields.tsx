import type { ServiceType } from '@prisma/client'
import { ServiceTypeSelector } from '@/components/guest/ServiceTypeSelector'
import { GuestDetailsForm } from '@/components/guest/GuestDetailsForm'
import { ItemList } from '@/components/guest/ItemList'
import { SERVICE_TYPES } from '@/lib/constants/services'
import { supportsService } from '@/lib/utils/selections'
import type { LaundryItemOption, LockedRoom, Selections } from '@/lib/types/guestOrder'

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
  lockedRoom?: LockedRoom
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
  lockedRoom,
}: Props) {
  // Services anything can actually be ordered under. The current default stays
  // offered even if nothing supports it- an edit mode draft can arrive on one,
  // and a radio group must always contain its own selection.
  const availableServiceTypes =
    items.length === 0
      ? []
      : SERVICE_TYPES.filter(
          (type) =>
            type === defaultServiceType ||
            items.some((item) => supportsService(item, type)),
        )

  return (
    <div className="flex-1 flex flex-col gap-6">
      <GuestDetailsForm lockedRoom={lockedRoom} />

      <ServiceTypeSelector
        serviceType={defaultServiceType}
        availableTypes={availableServiceTypes}
        isLoading={isLoading}
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
