'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useNotifications, type StaffNotification } from '@/lib/hooks/useNotifications'

const STORAGE_KEY = 'salt:staff-notifications'
const MAX_NOTIFICATIONS = 20

interface StoredState {
  notifications: StaffNotification[]
  unreadCount: number
}

function loadStoredState(): StoredState {
  if (typeof window === 'undefined') return { notifications: [], unreadCount: 0 }
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { notifications: [], unreadCount: 0 }
  } catch {
    return { notifications: [], unreadCount: 0 }
  }
}

// Persisted per-tab so a refresh doesn't lose what's already been observed —
// it can't recover requests that arrived while no staff tab was connected.
export function useBellNotifications() {
  const [notifications, setNotifications] = useState(() => loadStoredState().notifications)
  const [unreadCount, setUnreadCount] = useState(() => loadStoredState().unreadCount)
  const dedupeKey = (n: StaffNotification) => `${n.id}:${n.kind}:${n.timestamp}`
  const seenKeys = useRef(new Set(notifications.map(dedupeKey)))

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ notifications, unreadCount }))
    seenKeys.current = new Set(notifications.map(dedupeKey))
  }, [notifications, unreadCount])

  // Catch-up on reconnect can redeliver the exact same event — dedupe on
  // id+kind+timestamp so a different kind for the same request (e.g. assigned,
  // then later unassigned) is never mistaken for a repeat and dropped.
  const handleNewRequests = useCallback((requests: StaffNotification[]) => {
    const fresh = requests.filter((r) => !seenKeys.current.has(dedupeKey(r)))
    if (fresh.length === 0) return
    setNotifications((prev) => [...fresh, ...prev].slice(0, MAX_NOTIFICATIONS))
    setUnreadCount((prev) => prev + fresh.length)
  }, [])

  const { isConnected, permission, requestPermission } = useNotifications(handleNewRequests)
  const markAllRead = useCallback(() => setUnreadCount(0), [])

  return { notifications, unreadCount, isConnected, permission, requestPermission, markAllRead }
}
