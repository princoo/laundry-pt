import { PackageSearch } from 'lucide-react'

interface Props {
  message?: string
}

export function TrackNotFound({ message }: Props) {
  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-10 text-center">
      <PackageSearch className="w-10 h-10 text-salt-text-muted mx-auto mb-4" />
      <p className="text-base font-medium text-salt-text">No matching request</p>
      <p className="text-sm text-salt-text-muted mt-1">
        {message ?? 'Check the room number and reference, then try again.'}
      </p>
    </div>
  )
}
