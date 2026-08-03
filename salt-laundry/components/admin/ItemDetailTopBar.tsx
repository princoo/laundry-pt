import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export function ItemDetailTopBar() {
  return (
    <Link
      href="/staff/items"
      className="flex items-center gap-1.5 text-salt-text-sec text-sm hover:text-salt-text transition-colors pb-4 w-fit"
    >
      <ArrowLeft className="w-4 h-4" />
      Back to catalogue
    </Link>
  )
}
