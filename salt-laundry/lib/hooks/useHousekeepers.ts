'use client'

import { useEffect, useState } from 'react'

export interface Housekeeper {
  id: string
  name: string | null
  email: string
}

export function useHousekeepers() {
  const [housekeepers, setHousekeepers] = useState<Housekeeper[]>([])

  useEffect(() => {
    fetch('/api/supervisor/housekeepers')
      .then((res) => res.json())
      .then((data) => setHousekeepers(data.housekeepers ?? []))
  }, [])

  return housekeepers
}
