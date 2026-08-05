'use client'

import { useState } from 'react'
import type { ServiceType } from '@prisma/client'
import { setQuantity, setServiceType, applyDefaultService } from '@/lib/utils/selections'
import { defaultServiceFor } from '@/lib/utils/guestDraft'
import type { LaundryItemOption, Selections } from '@/lib/types/guestOrder'

// Owns the guest's per-item choices. The default service is a bulk control:
// changing it resets every item already in the order to that service, and
// individual items can be overridden again afterwards.
//
// `initial` seeds an edit with the order as it was saved. It's read once, so the
// form must not mount until that order has loaded.
export function useOrderSelections(
  items: readonly LaundryItemOption[],
  initial: Selections = {}
) {
  const [defaultServiceType, setDefaultServiceType] = useState<ServiceType>(() =>
    defaultServiceFor(initial)
  )
  const [selections, setSelections] = useState<Selections>(initial)

  const changeDefaultService = (serviceType: ServiceType) => {
    setDefaultServiceType(serviceType)
    setSelections((prev) => applyDefaultService(prev, items, serviceType))
  }

  const changeQuantity = (item: LaundryItemOption, quantity: number) => {
    setSelections((prev) => setQuantity(prev, item, quantity, defaultServiceType))
  }

  const changeService = (itemId: string, serviceType: ServiceType) => {
    setSelections((prev) => setServiceType(prev, itemId, serviceType))
  }

  return {
    defaultServiceType,
    changeDefaultService,
    selections,
    changeQuantity,
    changeService,
  }
}
