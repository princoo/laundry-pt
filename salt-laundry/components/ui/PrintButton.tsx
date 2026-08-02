'use client'

interface Props {
  label?: string
}

export function PrintButton({ label = 'Print invoice' }: Props) {
  return (
    <button
      onClick={() => window.print()}
      className="print:hidden bg-[#0d2137] text-white rounded-lg px-6 py-2.5 text-sm font-medium"
    >
      {label}
    </button>
  )
}
