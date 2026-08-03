'use client'

import { useState } from 'react'
import { RotateCw } from 'lucide-react'

interface Props {
  onRefresh: () => void | Promise<void>
  label?: string
}

export function RefreshButton({ onRefresh, label = 'Refresh' }: Props) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleClick = async () => {
    setIsRefreshing(true)
    try {
      await onRefresh()
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isRefreshing}
      aria-label={label}
      title={label}
      className="shrink-0 rounded-lg border border-[0.5px] border-salt-border bg-white p-1.5 text-salt-text-sec hover:bg-salt-cream hover:text-salt-text disabled:opacity-50 transition-colors"
    >
      <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
    </button>
  )
}
