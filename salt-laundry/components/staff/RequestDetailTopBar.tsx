import Link from 'next/link'

interface Props {
  requestId: string
}

export function RequestDetailTopBar({ requestId }: Props) {
  return (
    <div className="flex items-center justify-between">
      <Link href="/staff" className="text-salt-text-sec text-sm">
        ← Back to dashboard
      </Link>
      <Link
        href={`/staff/requests/${requestId}/invoice`}
        target="_blank"
        className="text-salt-text-sec text-sm hover:text-salt-text"
      >
        🖨 Print invoice
      </Link>
    </div>
  )
}
