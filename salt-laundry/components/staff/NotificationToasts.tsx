'use client'

import { useCallback, useState } from 'react'
import { ToastNotification } from '@/components/staff/ToastNotification'
import { useNotifications, type StaffNotification } from '@/lib/hooks/useNotifications'
import { NOTIFICATION_KIND_LABELS } from '@/lib/constants/notifications'

interface Toast {
  id: string
  message: string
}

export function NotificationToasts() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const handleNewRequests = useCallback((incoming: StaffNotification[]) => {
    setToasts((prev) => [
      ...prev,
      ...incoming.map((r) => ({
        id: r.id,
        message: `${NOTIFICATION_KIND_LABELS[r.kind] ?? 'New request'} — Room ${r.roomNumber}`,
      })),
    ])
  }, [])

  useNotifications(handleNewRequests)

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastNotification key={t.id} message={t.message} onDismiss={() => dismissToast(t.id)} />
      ))}
    </div>
  )
}
