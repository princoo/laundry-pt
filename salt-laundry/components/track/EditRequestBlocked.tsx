import Link from 'next/link'
import { Lock } from 'lucide-react'

interface Props {
  message: string
}

// The request moved on — collected, delivered, cancelled — or never existed.
// Either way there's nothing to edit, so the only useful action is going back.
export function EditRequestBlocked({ message }: Props) {
  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-10 text-center mt-6">
      <Lock className="w-10 h-10 text-salt-text-muted mx-auto mb-4" />
      <p className="text-base font-medium text-salt-text">This request can no longer be edited</p>
      <p className="text-sm text-salt-text-muted mt-1 max-w-md mx-auto">{message}</p>
      <Link
        href="/track"
        className="inline-block bg-salt-navy hover:bg-salt-navy-hover transition-colors text-white rounded-lg px-5 py-2.5 text-sm font-medium mt-6"
      >
        Back to your requests
      </Link>
    </div>
  )
}
