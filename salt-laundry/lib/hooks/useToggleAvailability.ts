'use client'

import { useState } from 'react'

export function useToggleAvailability(onChanged: () => void) {
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  async function toggle(id: string, nextIsAvailable: boolean) {
    const res = await fetch(`/api/staff/users/${id}/availability`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isAvailable: nextIsAvailable }),
    })
    if (!res.ok) return

    const data = await res.json()
    onChanged()
    if (data.message) setToastMessage(data.message)
  }

  return { toggle, toastMessage, dismissToast: () => setToastMessage(null) }
}
