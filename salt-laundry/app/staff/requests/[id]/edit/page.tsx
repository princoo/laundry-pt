'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, AlertTriangle, Lock } from 'lucide-react'
import { RequestForm } from '@/components/guest/RequestForm'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { AccessDenied } from '@/components/ui/AccessDenied'
import { useStaffEditableRequest } from '@/lib/hooks/useStaffEditableRequest'
import { usePermissions } from '@/lib/hooks/usePermissions'

export default function StaffEditRequestPage() {
  const { id } = useParams<{ id: string }>()
  const { can, isLoading: isSessionLoading } = usePermissions()
  const { draft, flagReason, carriedPrices, isLoading, error } = useStaffEditableRequest(id)

  if (!isSessionLoading && !can('LAUNDRY_REQUEST_EDIT')) {
    return <AccessDenied />
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <Link
        href={`/staff/requests/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-salt-navy hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to request
      </Link>

      {isLoading && (
        <div className="mt-6">
          <LoadingSkeleton rows={3} height="h-24" rounded="rounded-xl" />
        </div>
      )}
      {/* Not retryable: the usual reason for landing here is that the flag was
          already resolved, which is an answer rather than a failure. */}
      {!isLoading && error && (
        <div className="mt-6 bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-6 flex gap-3">
          <Lock className="w-5 h-5 text-salt-text-muted shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-salt-text">{error}</p>
            <Link
              href={`/staff/requests/${id}`}
              className="text-sm text-salt-navy hover:underline mt-2 inline-block"
            >
              Back to request
            </Link>
          </div>
        </div>
      )}

      {!isLoading && draft && (
        <>
          <div className="mt-4 mb-6">
            <h1 className="text-[22px] font-black text-salt-text">
              Correct request — Room {draft.roomNumber}
            </h1>
            <p className="text-sm text-salt-text-sec mt-1 max-w-xl">
              Items already on this request keep the price the guest was quoted, even if
              the catalogue has changed since. Only items you add are priced from today&apos;s
              catalogue.
            </p>
          </div>

          {flagReason && (
            <div className="bg-amber-50 border border-[0.5px] border-amber-200 rounded-xl p-4 mb-6 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900">Flagged for changes</p>
                <p className="text-sm text-amber-900 mt-0.5">{flagReason}</p>
              </div>
            </div>
          )}

          <RequestForm
            mode="staff-edit"
            requestId={id}
            initialData={draft}
            carriedPrices={carriedPrices}
          />
        </>
      )}
    </div>
  )
}
