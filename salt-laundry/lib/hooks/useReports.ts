'use client'

import { useCallback, useEffect, useState } from 'react'
import { rangeFor, startOfMonth, toISODate, type QuickRange } from '@/lib/utils/dateRange'
import type { Report } from '@/lib/types/report'

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
    const { from: fromStr, to: toStr } = rangeFor(quick)
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
