'use client'

import { useEffect } from 'react'

export function useAutoRefresh(callback: () => void, intervalMs = 30_000) {
  useEffect(() => {
    callback()
    const id = setInterval(callback, intervalMs)
    const onVisibility = () => {
      if (!document.hidden) callback()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [callback, intervalMs])
}
