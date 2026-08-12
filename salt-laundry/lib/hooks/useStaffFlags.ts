'use client'

import { useState } from 'react'
import { apiFetch } from '@/lib/apiClient'

// The only writes the staff roster has left. Both flags share one toast,
// because they sit in the same row and only one can be switched at a time.
export function useStaffFlags(onChanged: () => void) {
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  async function patch(id: string, segment: string, body: Record<string, boolean>) {
    const res = await apiFetch(`/api/staff/users/${id}/${segment}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) return

    const data = await res.json()
    onChanged()
    if (data.message) setToastMessage(data.message)
  }

  return {
    toggleAvailability: (id: string, isAvailable: boolean) =>
      patch(id, 'availability', { isAvailable }),
    toggleHousekeeper: (id: string, isHousekeeper: boolean) =>
      patch(id, 'housekeeper', { isHousekeeper }),
    toastMessage,
    dismissToast: () => setToastMessage(null),
  }
}
