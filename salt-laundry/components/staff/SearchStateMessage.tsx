import { Search } from 'lucide-react'

interface Props {
  variant: 'idle' | 'empty'
  message?: string
}

export function SearchStateMessage({ variant, message }: Props) {
  const defaultMessage = variant === 'idle'
    ? 'Enter a room number or guest name to search.'
    : 'No requests found matching your filters.'

  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm py-14 sm:py-16 px-4 text-center">
      <Search className="w-9 h-9 sm:w-10 sm:h-10 text-salt-text-muted mx-auto mb-3" />
      <p className="text-base text-salt-text-sec">{message ?? defaultMessage}</p>
    </div>
  )
}
