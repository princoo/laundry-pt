'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { RequestFormMode, Selections } from '@/lib/types/guestOrder'

interface SaveInput {
  roomNumber: string
  guestName?: string
  note?: string
  isHanger: boolean
  isExpress: boolean
  selections: Selections
}

const GENERIC_ERROR = 'Something went wrong. Try again or call reception.'

// Each line carries its own service; isExpress stays request-level.
function toItems(selections: Selections) {
  return Object.entries(selections)
    .filter(([, selection]) => selection.quantity > 0)
    .map(([laundryItemId, { serviceType, quantity }]) => ({
      laundryItemId,
      serviceType,
      quantity,
    }))
}

// One save path for both modes. The payloads are identical apart from the room,
// which only a new request carries — an edit can never change it.
export function useSaveRequest(mode: RequestFormMode, requestId?: string) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const isEdit = mode === 'edit'

  const save = async (input: SaveInput) => {
    setIsSaving(true)
    setSaveError(null)
    const items = toItems(input.selections)

    try {
      const res = await fetch(isEdit ? `/api/requests/${requestId}/edit` : '/api/requests', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: input.guestName || undefined,
          note: input.note || undefined,
          isHanger: input.isHanger,
          isExpress: input.isExpress,
          items,
          ...(isEdit ? {} : { roomNumber: input.roomNumber }),
        }),
      })
      const data = await res.json()

      if (res.ok) {
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
        router.push(
          isEdit
            ? `/track?${new URLSearchParams({ room: input.roomNumber, edited: '1' })}`
            : `/confirmation?${new URLSearchParams({
                reference: data.reference,
                room: input.roomNumber,
                items: String(itemCount),
              })}`
        )
        return
      }
      // 403 carries the "already collected" message — surface it, don't mask it.
      setSaveError(res.status >= 500 ? GENERIC_ERROR : data.error ?? GENERIC_ERROR)
    } catch {
      setSaveError(GENERIC_ERROR)
    } finally {
      setIsSaving(false)
    }
  }

  return { save, isSaving, saveError, dismissError: () => setSaveError(null) }
}
