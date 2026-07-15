'use client'

import { useEffect } from 'react'

interface Props {
  message: string | null
  onDismiss: () => void
}

export function ErrorToast({ message, onDismiss }: Props) {
  useEffect(() => {
    if (!message) return
    const id = setTimeout(onDismiss, 4000)
    return () => clearTimeout(id)
  }, [message, onDismiss])

  if (!message) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-600 text-white text-sm px-4 py-3 rounded-lg shadow-sm">
      {message}
    </div>
  )
}
