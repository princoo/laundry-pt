'use client'

import { Download } from 'lucide-react'
import type { RefObject } from 'react'
import { usePdfDownload } from '@/lib/hooks/usePdfDownload'

interface Props {
  targetRef: RefObject<HTMLElement | null>
  filename: string
  label?: string
}

export function DownloadPdfButton({ targetRef, filename, label = 'Download PDF' }: Props) {
  const { download, isGenerating } = usePdfDownload(targetRef, filename)

  return (
    <button
      type="button"
      onClick={download}
      disabled={isGenerating}
      className="print:hidden flex items-center justify-center gap-2 bg-white border border-[0.5px] border-salt-navy text-salt-navy rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-salt-cream transition-colors disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-salt-navy"
    >
      <Download className="w-4 h-4" />
      {isGenerating ? 'Preparing…' : label}
    </button>
  )
}
