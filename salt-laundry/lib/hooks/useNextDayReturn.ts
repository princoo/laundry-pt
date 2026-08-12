'use client'

import { useCallback, useSyncExternalStore } from 'react'
import type { ServiceType } from '@prisma/client'
import { isNextDayReturn } from '@/lib/utils/returnCutoff'

// Whether the cutoff has passed depends on the current time, which the server
// cannot know in the guest's timezone — so this is read on the client only.
// Nothing pushes updates: the answer is fixed for the life of the form, and a
// guest who sits on the page across the cutoff sees it on their next action.
const subscribe = () => () => {}

// The server has no device clock, so it renders the plain same-day case and the
// client swaps in the real answer after hydration — same shape as useLanguage,
// and no markup mismatch.
const getServerSnapshot = () => false

export function useNextDayReturn(
  serviceTypes: readonly ServiceType[],
  isExpress = false
): boolean {
  // Callers build the array inline, so depend on its contents, not its identity.
  const key = serviceTypes.join(',')

  const getSnapshot = useCallback(() => {
    const types = key ? (key.split(',') as ServiceType[]) : []
    return isNextDayReturn(types, isExpress)
  }, [key, isExpress])

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
