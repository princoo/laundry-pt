'use client'

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/apiClient'
import { lineKey } from '@/lib/utils/pricing'
import { toGuestOrderDraft } from '@/lib/utils/guestDraft'
import type { GuestOrderDraft } from '@/lib/types/guestOrder'
import type { ServiceType } from '@prisma/client'

const GENERIC_ERROR = 'Failed to load this request.'

interface SavedLine {
  laundryItemId: string
  serviceType: ServiceType
  unitPrice: number
}

// The staff-side twin of useEditableRequest. Same shape, but through apiFetch so
// a lapsed SOA session redirects to sign-in instead of reading as a load
// failure, and it carries the flag reason back so the editor can see what they
// are being asked to fix.
export function useStaffEditableRequest(requestId: string) {
  const [draft, setDraft] = useState<GuestOrderDraft | null>(null)
  const [flagReason, setFlagReason] = useState<string | null>(null)
  // What each line already on the request is charged at, so the form previews
  // the total the server will actually save rather than today's catalogue.
  const [carriedPrices, setCarriedPrices] = useState<ReadonlyMap<string, number>>(new Map())
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    apiFetch(`/api/staff/requests/${requestId}/edit`)
      .then(async (res) => {
        const data = await res.json()
        if (cancelled) return
        if (res.ok) {
          setDraft(toGuestOrderDraft(data.request))
          setFlagReason(data.request.flagReason ?? null)
          setCarriedPrices(
            new Map(
              (data.request.items as SavedLine[]).map((line) => [
                lineKey(line.laundryItemId, line.serviceType),
                line.unitPrice,
              ])
            )
          )
        } else {
          setError(data.error ?? GENERIC_ERROR)
        }
      })
      .catch(() => {
        if (!cancelled) setError(GENERIC_ERROR)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [requestId])

  return { draft, flagReason, carriedPrices, isLoading, error }
}
