'use client'

import { useCallback, useState } from 'react'
import type { RequestNote } from '@/lib/types/request'
import { apiFetch } from '@/lib/apiClient'

export function useRequestNotes(requestId: string, initialNotes: RequestNote[]) {
  const [notes, setNotes] = useState<RequestNote[]>(initialNotes)
  const [newNote, setNewNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitNote = useCallback(async () => {
    if (!newNote.trim() || isSubmitting) return
    setIsSubmitting(true)
    setError(null)
    try {
      const res = await apiFetch(`/api/staff/requests/${requestId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNote }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? 'Could not add note.')
      setNotes((prev) => [...prev, data])
      setNewNote('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add note.')
    } finally {
      setIsSubmitting(false)
    }
  }, [requestId, newNote, isSubmitting])

  return { notes, newNote, setNewNote, isSubmitting, error, submitNote }
}
