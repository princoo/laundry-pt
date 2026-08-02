'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'

interface Props {
  requestId: string
  onAcknowledged: () => void
}

export function AcknowledgeButton({ requestId, onAcknowledged }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    setIsSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`/api/staff/requests/${requestId}/acknowledge`, { method: 'POST' })
      if (!res.ok) throw new Error()
      onAcknowledged()
    } catch {
      setError('Could not acknowledge. Try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-4 flex items-center justify-between gap-4">
      <div className="flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-800 mt-0.5 shrink-0" />
        <div>
          <div className="text-[15px] font-medium text-amber-800">Acknowledge this assignment</div>
          <div className="text-xs text-amber-700 mt-0.5">
            Tap to confirm you have seen this request and will collect it.
          </div>
          {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
        </div>
      </div>
      <button
        type="button"
        onClick={handleClick}
        disabled={isSubmitting}
        className="bg-amber-500 text-white rounded-lg px-4 py-2 text-sm disabled:opacity-60 flex items-center gap-2 shrink-0"
      >
        {isSubmitting && (
          <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        )}
        {isSubmitting ? 'Confirming…' : 'Acknowledge'}
      </button>
    </div>
  )
}
