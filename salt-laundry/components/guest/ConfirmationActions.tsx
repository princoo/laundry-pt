import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface Props {
  trackHref: string
}

export function ConfirmationActions({ trackHref }: Props) {
  return (
    <div className="mt-8 flex flex-col sm:flex-row gap-3">
      <Link
        href={trackHref}
        className="flex-1 text-center bg-salt-navy hover:bg-salt-navy-hover transition-colors text-white rounded-lg py-3 font-medium flex items-center justify-center gap-1.5"
      >
        Track this order <ArrowRight className="w-4 h-4" />
      </Link>
      <Link
        href="/"
        className="flex-1 text-center border border-[0.5px] border-salt-navy text-salt-navy hover:bg-white transition-colors rounded-lg py-3 font-medium"
      >
        New request
      </Link>
    </div>
  )
}
