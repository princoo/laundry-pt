'use client'

import { useCallback, useEffect, useState } from 'react'
import { subscribe, getIsConnected, type StaffNotification } from '@/lib/hooks/notificationConnection'

export type { StaffNotification }

export function useNotifications(onNewRequests: (requests: StaffNotification[]) => void) {
  const [isConnected, setIsConnected] = useState(getIsConnected)
  const [permission, setPermission] = useState<NotificationPermission>(() =>
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  )

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return
    setPermission(await Notification.requestPermission())
  }, [])

  useEffect(() => subscribe(onNewRequests, setIsConnected), [onNewRequests])

  return { isConnected, permission, requestPermission }
}
