import Link from 'next/link'
import { Pencil, AlertTriangle } from 'lucide-react'
import {
  GUEST_EDITABLE_STATUS,
  EDIT_LOCKED_REASONS,
  NEEDS_CHANGES_GUEST_MESSAGE,
} from '@/lib/constants/statuses'
import type { TrackedRequest } from '@/lib/types/request'

interface Props {
  request: TrackedRequest
}

// The guest's own way back into a request they haven't handed over yet — and,
// when staff have sent it back, the reason they are being asked to look.
//
// The staff-written flagReason is deliberately never shown here: it is shorthand
// one staff member wrote for another, and the public track endpoints do not even
// return it. The guest gets fixed copy instead.
export function EditRequestPrompt({ request }: Props) {
  const isEditable = request.status === GUEST_EDITABLE_STATUS

  if (request.needsChanges) {
    return (
      <div className="bg-amber-50 rounded-xl border border-[0.5px] border-amber-200 p-4 sm:p-6 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-900">Please check your request</p>
            <p className="text-xs text-amber-800 mt-0.5">
              {NEEDS_CHANGES_GUEST_MESSAGE}{' '}
              {isEditable
                ? 'Please update it so we can get started.'
                : 'Our team is correcting it for you — there is nothing you need to do.'}
            </p>
          </div>
        </div>
        {isEditable && (
          <Link
            href={`/track/${request.id}/edit`}
            className="bg-salt-navy hover:bg-salt-navy-hover transition-colors text-white rounded-lg px-5 py-2.5 text-sm font-medium inline-flex items-center justify-center gap-2 min-h-[44px] shrink-0"
          >
            <Pencil className="w-4 h-4" />
            Update request
          </Link>
        )}
      </div>
    )
  }

  if (!isEditable) {
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
