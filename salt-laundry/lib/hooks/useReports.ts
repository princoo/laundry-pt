'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Report } from '@/lib/types/report'

export const QUICK_RANGES = ['This month', 'Last month', 'Last 30 days', 'Last 90 days'] as const
export type QuickRange = (typeof QUICK_RANGES)[number]

function toISODate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function rangeFor(quick: QuickRange): { from: Date; to: Date } {
  const today = new Date()
  if (quick === 'This month') return { from: startOfMonth(today), to: today }
  if (quick === 'Last month') {
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)
    return { from: startOfMonth(lastMonthEnd), to: lastMonthEnd }
  }
  const days = quick === 'Last 30 days' ? 30 : 90
  const from = new Date(today)
  from.setDate(from.getDate() - days + 1)
  return { from, to: today }
}

export function useReports() {
  const [from, setFrom] = useState(() => toISODate(startOfMonth(new Date())))
  const [to, setTo] = useState(() => toISODate(new Date()))
  const [report, setReport] = useState<Report | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const generate = useCallback(async (rangeFrom: string, rangeTo: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const qs = new URLSearchParams({ from: rangeFrom, to: rangeTo })
      const res = await fetch(`/api/admin/reports?${qs}`)
      if (!res.ok) throw new Error('Failed to load report')
      setReport(await res.json())
    } catch {
      setError('Failed to generate report.')
      setReport(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const applyQuickRange = useCallback((quick: QuickRange) => {
    const { from: f, to: t } = rangeFor(quick)
    const fromStr = toISODate(f)
    const toStr = toISODate(t)
    setFrom(fromStr)
    setTo(toStr)
    generate(fromStr, toStr)
  }, [generate])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount
    generate(from, to)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    from, setFrom, to, setTo,
    report, isLoading, error,
    generate: () => generate(from, to),
    applyQuickRange,
  }
}
