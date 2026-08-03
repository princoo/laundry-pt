'use client'

import { useEffect, useState } from 'react'

export interface OnShiftRow {
  id: string
  name: string | null
  activeTaskCount: number
}

export interface OffShiftRow {
  id: string
  name: string | null
}

export function useStaffOverview(isOpen: boolean) {
  const [onShift, setOnShift] = useState<OnShiftRow[]>([])
  const [offShift, setOffShift] = useState<OffShiftRow[]>([])
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  function load() {
    fetch('/api/supervisor/staff-overview')
      .then((res) => res.json())
      .then((data) => {
        setOnShift(data.onShift ?? [])
        setOffShift(data.offShift ?? [])
      })
  }

  useEffect(() => { if (isOpen) load() }, [isOpen])

  async function setAvailability(id: string, isAvailable: boolean) {
    const res = await fetch(`/api/staff/users/${id}/availability`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isAvailable }),
    })
    if (res.ok) {
      const data = await res.json()
      if (data.message) setToastMessage(data.message)
    }
    load()
  }

  return {
    onShift,
    offShift,
    markOnShift: (id: string) => setAvailability(id, true),
    markOffShift: (id: string) => setAvailability(id, false),
    toastMessage,
    dismissToast: () => setToastMessage(null),
  }
}
