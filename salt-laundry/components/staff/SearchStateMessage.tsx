import { Search } from 'lucide-react'

interface Props {
  variant: 'idle' | 'empty'
}

export function SearchStateMessage({ variant }: Props) {
  const message = variant === 'idle'
    ? 'Enter a room number or guest name to search.'
    : 'No requests found matching your filters.'

  return (
    <div className="text-center mt-16">
      <Search className="w-10 h-10 text-salt-text-muted mx-auto mb-3" />
      <p className="text-base text-salt-text-sec">{message}</p>
    </div>
  )
}
