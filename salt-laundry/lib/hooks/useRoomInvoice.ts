'use client'

import { useCallback, useState } from 'react'
import type { ServiceType } from '@prisma/client'

export interface RoomInvoiceItem {
  id: string
  quantity: number
  unitPrice: number
  subtotal: number
  laundryItem: { nameEn: string }
}

export interface RoomInvoiceRequest {
  id: string
  createdAt: string
  serviceType: ServiceType
  grossAmount: number
  vatAmount: number
  totalAmount: number
  items: RoomInvoiceItem[]
}

export interface RoomInvoiceData {
  requests: RoomInvoiceRequest[]
  grossTotal: number
  vatTotal: number
  grandTotal: number
}

export function useRoomInvoice() {
  const [room, setRoom] = useState('')
  const [roomSearched, setRoomSearched] = useState('')
  const [data, setData] = useState<RoomInvoiceData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async () => {
    const value = room.trim()
    if (!value) return
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/staff/invoices?room=${encodeURIComponent(value)}`)
      if (!res.ok) throw new Error('Failed to generate invoice')
      const json = await res.json()
      setData(json)
      setRoomSearched(value)
    } catch {
      setError('Failed to generate invoice. Try again.')
      setData(null)
    } finally {
      setIsLoading(false)
    }
  }, [room])

  return { room, setRoom, roomSearched, data, isLoading, error, search }
}
