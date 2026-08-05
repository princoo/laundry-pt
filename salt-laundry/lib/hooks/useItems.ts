'use client'

import { useCallback, useEffect, useState } from 'react'
import type { LaundryItemOption } from '@/lib/types/guestOrder'

// One fetch for the whole catalogue: every item carries the services it's
// priced for, so changing an item's service needs no round trip.
export function useItems() {
  const [items, setItems] = useState<LaundryItemOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = useCallback(() => {
    let cancelled = false

    fetch('/api/items')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load items')
        return res.json()
      })
      .then((data) => {
        if (!cancelled) {
          setItems(data.items ?? [])
          setError(null)
        }
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load items.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => fetchItems(), [fetchItems])

  return { items, isLoading, error, refetch: fetchItems }
}
