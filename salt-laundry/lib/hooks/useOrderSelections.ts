'use client'

import { useState } from 'react'
import type { ServiceType } from '@prisma/client'
import { addOne, setLineQuantity } from '@/lib/utils/selections'
import { defaultServiceFor } from '@/lib/utils/guestDraft'
import type { LaundryItemOption, Selections } from '@/lib/types/guestOrder'

// Owns the guest's per-line choices. A line is one item under one service, so
// the same item can be in the order twice- two shirts washed, one pressed.
//
// The default service only governs what comes next: it prices untouched rows
// and picks the service their first tap lands on. Lines already in the order
// are never rewritten by it- the row they live on is what decides their
// service, and it stays the only thing that does.
//
// `initial` seeds an edit with the order as it was saved. It's read once, so the
// form must not mount until that order has loaded.
export function useOrderSelections(initial: Selections = {}) {
  const [defaultServiceType, changeDefaultService] = useState<ServiceType>(() =>
    defaultServiceFor(initial)
  )
  const [selections, setSelections] = useState<Selections>(initial)

  // Sets one line outright- the per-service steppers on an opened row know
  // exactly which service they are counting.
  const changeLineQuantity = (
    item: LaundryItemOption,
    serviceType: ServiceType,
    quantity: number
  ) => {
    setSelections((prev) => setLineQuantity(prev, item.id, serviceType, quantity))
  }

  // "One more of this", from a control with no service of its own: a collapsed
  // row's stepper or a search result.
  const addItem = (item: LaundryItemOption) => {
    setSelections((prev) => addOne(prev, item, defaultServiceType))
  }

  return {
    defaultServiceType,
    changeDefaultService,
    selections,
    changeLineQuantity,
    addItem,
  }
}
