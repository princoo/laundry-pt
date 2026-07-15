'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ServiceType } from '@prisma/client'

interface SubmitInput {
  roomNumber: string
  guestName?: string
  serviceType: ServiceType
  isExpress: boolean
  isHanger: boolean
  note?: string
  items: { id: string }[]
  quantities: Record<string, number>
}

const GENERIC_ERROR = 'Something went wrong. Try again or call reception.'

export function useSubmitRequest() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const submit = async (input: SubmitInput) => {
    setIsSubmitting(true)
    setSubmitError(null)

    const payload = {
      roomNumber: input.roomNumber,
      guestName: input.guestName || undefined,
      serviceType: input.serviceType,
      isExpress: input.serviceType === 'NORMAL' ? input.isExpress : false,
      isHanger: input.isHanger,
      note: input.note || undefined,
      items: input.items
        .filter((item) => (input.quantities[item.id] ?? 0) > 0)
        .map((item) => ({ laundryItemId: item.id, quantity: input.quantities[item.id] })),
    }

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (res.status === 201) {
        const itemCount = payload.items.reduce((sum, item) => sum + item.quantity, 0)
        const params = new URLSearchParams({
          reference: data.reference,
          room: input.roomNumber,
          items: String(itemCount),
        })
        router.push(`/confirmation?${params}`)
        return
      }
      setSubmitError(res.status === 400 ? data.error : GENERIC_ERROR)
    } catch {
      setSubmitError(GENERIC_ERROR)
    } finally {
      setIsSubmitting(false)
    }
  }

  return { submit, isSubmitting, submitError, dismissError: () => setSubmitError(null) }
}
