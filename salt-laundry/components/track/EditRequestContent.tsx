'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { GuestNav } from '@/components/guest/GuestNav'
import { GuestFooter } from '@/components/guest/GuestFooter'
import { RequestForm } from '@/components/guest/RequestForm'
import { EditRequestBlocked } from '@/components/track/EditRequestBlocked'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { useEditableRequest } from '@/lib/hooks/useEditableRequest'

interface Props {
  requestId: string
}

export function EditRequestContent({ requestId }: Props) {
  const { draft, isLoading, error } = useEditableRequest(requestId)
  const backHref = draft ? `/track?room=${encodeURIComponent(draft.roomNumber)}` : '/track'

  return (
    <div className="min-h-screen bg-salt-cream pb-24 md:pb-0 flex flex-col">
      <GuestNav active="track" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm text-salt-navy mt-8 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to your requests
        </Link>

        {isLoading && (
          <div className="mt-6">
            <LoadingSkeleton rows={3} height="h-24" rounded="rounded-xl" />
          </div>
        )}
        {error && <EditRequestBlocked message={error} />}

        {draft && (
          <>
            <div className="mt-4 mb-6">
              <h1 className="text-[28px] sm:text-[32px] font-black text-salt-text">
                Edit request — Room {draft.roomNumber}
              </h1>
              <p className="text-sm text-salt-text-sec mt-1 max-w-xl">
                Change your items or details below. You can edit until we collect your laundry.
              </p>
            </div>
            <RequestForm mode="edit" requestId={requestId} initialData={draft} />
          </>
        )}
      </div>

      <GuestFooter />
    </div>
  )
}
