import Link from 'next/link'
import { ArrowLeft, Printer } from 'lucide-react'

interface Props {
  requestId: string
}

export function RequestDetailTopBar({ requestId }: Props) {
  return (
    <div className="flex items-center justify-between pb-4">
      <Link
        href="/staff"
        className="flex items-center gap-1.5 text-salt-text-sec text-sm hover:text-salt-text transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to dashboard
      </Link>
      <Link
        href={`/staff/requests/${requestId}/invoice`}
        target="_blank"
        className="flex items-center gap-1.5 text-salt-text-sec text-sm border border-[0.5px] border-salt-border rounded-lg px-3 py-1.5 hover:text-salt-text hover:bg-salt-cream transition-colors"
      >
        <Printer className="w-3.5 h-3.5" />
        Print invoice
      </Link>
    </div>
  )
}
