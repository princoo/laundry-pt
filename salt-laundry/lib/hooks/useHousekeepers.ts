'use client'

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/apiClient'

export interface Housekeeper {
  id: string
  name: string | null
  email: string
  isAvailable: boolean
}

export function useHousekeepers() {
  const [housekeepers, setHousekeepers] = useState<Housekeeper[]>([])

  useEffect(() => {
    apiFetch('/api/supervisor/housekeepers')
      .then((res) => res.json())
      .then((data) => setHousekeepers(data.housekeepers ?? []))
  }, [])

  return housekeepers
}

// Off-shift housekeepers stay selectable — a supervisor sometimes has to hand
// work to someone who has just clocked off — so the label carries the warning
// rather than the list hiding them.
export function housekeeperOption(h: Housekeeper) {
  const name = h.name ?? h.email
  return { value: h.id, label: h.isAvailable ? name : `${name} — off shift` }
}
