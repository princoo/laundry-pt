'use client'

import { useRef } from 'react'
import type { ReactNode } from 'react'
import { PrintButton } from '@/components/ui/PrintButton'
import { DownloadPdfButton } from '@/components/ui/DownloadPdfButton'

interface Props {
  filename: string
  showActions?: boolean
  // 'top' pairs the actions with a summary above the sheet, so a long invoice
  // does not have to be scrolled past before it can be printed.
  actionsPosition?: 'top' | 'bottom'
  summary?: ReactNode
  children: ReactNode
}

export function InvoiceCard({
  filename, showActions = true, actionsPosition = 'bottom', summary, children,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isTop = actionsPosition === 'top'

  const actions = showActions ? (
    <div className={`print:hidden flex flex-col sm:flex-row gap-3 ${isTop ? 'sm:shrink-0' : 'justify-center mt-8'}`}>
      <PrintButton />
      <DownloadPdfButton targetRef={ref} filename={filename} />
    </div>
  ) : null

  return (
    <>
      {isTop && (
        <div className="print:hidden mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="min-w-0">{summary}</div>
          {actions}
        </div>
      )}

      <div
        ref={ref}
        className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-6 sm:p-10 print:shadow-none print:border-none print:rounded-none print:p-0"
      >
        {children}
      </div>

      {!isTop && actions}
    </>
  )
}
