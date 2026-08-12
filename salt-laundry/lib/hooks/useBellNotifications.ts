'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useNotifications, type StaffNotification } from '@/lib/hooks/useNotifications'

const STORAGE_PREFIX = 'salt:staff-notifications'
const MAX_NOTIFICATIONS = 20

interface StoredState {
  notifications: StaffNotification[]
  unreadCount: number
}

function loadStoredState(storageKey: string): StoredState {
  try {
    const raw = sessionStorage.getItem(storageKey)
    return raw ? JSON.parse(raw) : { notifications: [], unreadCount: 0 }
  } catch {
    return { notifications: [], unreadCount: 0 }
  }
}

// Persisted per-tab, namespaced by user id — a refresh doesn't lose what's
// already been observed, and switching accounts in the same tab can't leak
// one housekeeper's notifications into another's.
export function useBellNotifications() {
  const { data: session } = useSession()
  const userId = (session?.user as { id?: string } | undefined)?.id
  const storageKey = userId ? `${STORAGE_PREFIX}:${userId}` : null

  const [notifications, setNotifications] = useState<StaffNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loadedKey, setLoadedKey] = useState<string | null>(null)
  const dedupeKey = (n: StaffNotification) => `${n.id}:${n.kind}:${n.timestamp}`
  const seenKeys = useRef(new Set<string>())

  // Load this user's own stored notifications once we know who they are, and
  // again if the account in this tab changes.
  //
  // Adjusted during render rather than in an effect — the same loadedKey idiom
  // as useStaffDashboard and useRequestDetail. An effect would paint one frame
  // of an empty bell before the stored notifications appeared, and React treats
  // setting state while rendering the same component as the supported way to
  // react to a changed input. loadStoredState is guarded, so the server pass —
  // where there is no sessionStorage and no session id — simply skips it.
  // seenKeys is deliberately not rebuilt here: the persist effect below already
  // derives it from `notifications` on every change, including this one, and a
  // ref must not be written during render.
  if (storageKey && storageKey !== loadedKey) {
    const stored = loadStoredState(storageKey)
    setLoadedKey(storageKey)
    setNotifications(stored.notifications)
    setUnreadCount(stored.unreadCount)
  }

  useEffect(() => {
    if (!storageKey) return
    sessionStorage.setItem(storageKey, JSON.stringify({ notifications, unreadCount }))
    seenKeys.current = new Set(notifications.map(dedupeKey))
  }, [notifications, unreadCount, storageKey])

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
