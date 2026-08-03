'use client'

import { useEffect, useState } from 'react'
import type { ServiceType } from '@prisma/client'
import { isNextDayReturn } from '@/lib/utils/returnCutoff'

// Resolves after mount so the server's timezone never decides what the guest
// sees — their own device clock is the one in the hotel's timezone. Starts
// false so the server-rendered markup is the plain same-day case.
export function useNextDayReturn(serviceType: ServiceType, isExpress = false): boolean {
  const [isNextDay, setIsNextDay] = useState(false)

  useEffect(() => {
    setIsNextDay(isNextDayReturn(serviceType, isExpress))
  }, [serviceType, isExpress])

  return isNextDay
}
