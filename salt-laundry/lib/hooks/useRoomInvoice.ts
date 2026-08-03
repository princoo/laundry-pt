'use client'

import { useCallback, useState } from 'react'
import { EMPTY_ROOM_INVOICE_FILTERS } from '@/lib/constants/invoiceFilters'
import type { RoomInvoiceData, RoomInvoiceFilters } from '@/lib/types/roomInvoice'

function buildQuery(filters: RoomInvoiceFilters): string {
  const qs = new URLSearchParams({ room: filters.room.trim() })
  if (filters.guestName.trim()) qs.set('guestName', filters.guestName.trim())
  if (filters.serviceType) qs.set('serviceType', filters.serviceType)
  if (filters.express !== 'ALL') qs.set('express', filters.express)
  if (filters.from) qs.set('from', filters.from)
  if (filters.to) qs.set('to', filters.to)
  return qs.toString()
}

export function useRoomInvoice() {
  const [filters, setFilters] = useState<RoomInvoiceFilters>(EMPTY_ROOM_INVOICE_FILTERS)
  const [applied, setApplied] = useState<RoomInvoiceFilters | null>(null)
  const [data, setData] = useState<RoomInvoiceData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async () => {
    if (!filters.room.trim()) return
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/staff/invoices?${buildQuery(filters)}`)
      if (!res.ok) throw new Error('Failed to generate invoice')
      setData(await res.json())
      setApplied({ ...filters, room: filters.room.trim() })
    } catch {
      setError('Failed to generate invoice. Try again.')
      setData(null)
      setApplied(null)
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  const reset = useCallback(() => {
    setFilters(EMPTY_ROOM_INVOICE_FILTERS)
    setApplied(null)
    setData(null)
    setError(null)
  }, [])

  return { filters, setFilters, applied, data, isLoading, error, search, reset }
}
