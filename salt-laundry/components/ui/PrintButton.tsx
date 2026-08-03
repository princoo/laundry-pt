'use client'

import { Printer } from 'lucide-react'

interface Props {
  label?: string
}

export function PrintButton({ label = 'Print invoice' }: Props) {
  return (
    <button
      onClick={() => window.print()}
      className="print:hidden flex items-center gap-2 bg-salt-navy hover:bg-salt-navy-hover text-white rounded-lg px-6 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-salt-navy"
    >
      <Printer className="w-4 h-4" />
      {label}
    </button>
  )
}
