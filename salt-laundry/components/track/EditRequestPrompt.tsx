import Link from 'next/link'
import { Pencil } from 'lucide-react'
import { GUEST_EDITABLE_STATUS, EDIT_LOCKED_REASONS } from '@/lib/constants/statuses'
import type { TrackedRequest } from '@/lib/types/request'

interface Props {
  request: TrackedRequest
}

// The guest's own way back into a request they haven't handed over yet.
export function EditRequestPrompt({ request }: Props) {
  if (request.status !== GUEST_EDITABLE_STATUS) {
    return (
      <p className="text-xs text-salt-text-muted text-center mt-4">
        {EDIT_LOCKED_REASONS[request.status]}
      </p>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-4 sm:p-6 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-salt-text">Need to change something?</p>
        <p className="text-xs text-salt-text-muted mt-0.5">
          You can edit this request until we collect your laundry.
        </p>
      </div>
      <Link
        href={`/track/${request.id}/edit`}
        className="bg-salt-navy hover:bg-salt-navy-hover transition-colors text-white rounded-lg px-5 py-2.5 text-sm font-medium inline-flex items-center justify-center gap-2 min-h-[44px]"
      >
        <Pencil className="w-4 h-4" />
        Edit request
      </Link>
    </div>
  )
}
