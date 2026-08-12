'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Plus } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { STATUS_LABELS } from '@/lib/constants/statuses'
import type { RequestStatus } from '@prisma/client'

export interface ActiveRequestSummary {
  reference: string
  status: RequestStatus
  totalItems: number
}

interface Props {
  room: string
  requests: ActiveRequestSummary[]
}

// Scanning the room's QR code is how a guest checks on laundry they have already
// sent, not just how they start new laundry — the code is the same sticker on
// the same door either way. So when the room already has laundry with us, say so
// before they fill the form in again.
//
// Opens by default rather than on an effect: the check runs on the server, so
// the dialog is part of the first paint and the guest never sees the form flash
// past before being interrupted.
export function ActiveRequestDialog({ room, requests }: Props) {
  const [isOpen, setIsOpen] = useState(true)
  if (!isOpen || requests.length === 0) return null

  const isOne = requests.length === 1

  return (
    <Modal title="You already have laundry with us" onClose={() => setIsOpen(false)}>
      <p className="text-sm text-salt-text-sec">
        {isOne
          ? `Room ${room} has a request with us already.`
          : `Room ${room} has ${requests.length} requests with us already.`}{' '}
        You can check where {isOne ? 'it has' : 'they have'} got to, or start another one.
      </p>

      <div className="mt-3 flex flex-col gap-2">
        {requests.map((request) => (
          <div
            key={request.reference}
            className="flex items-center justify-between gap-3 rounded-lg border border-[0.5px] border-salt-border bg-salt-cream px-3 py-2"
          >
            <span className="text-sm text-salt-text">{request.reference}</span>
            <span className="text-xs text-salt-text-sec">
              {request.totalItems} {request.totalItems === 1 ? 'item' : 'items'} ·{' '}
              {STATUS_LABELS[request.status]}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:justify-end gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="w-full sm:w-auto border border-[0.5px] border-salt-border rounded-lg px-4 py-2.5 text-sm text-salt-text hover:bg-salt-cream transition-colors inline-flex items-center justify-center gap-2 min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          Start a new request
        </button>
        <Link
          href={`/track?room=${encodeURIComponent(room)}`}
          className="w-full sm:w-auto bg-salt-navy hover:bg-salt-navy-hover transition-colors text-white rounded-lg px-5 py-2.5 text-sm font-medium inline-flex items-center justify-center gap-2 min-h-[44px]"
        >
          <Search className="w-4 h-4" />
          Track {isOne ? 'my order' : 'my orders'}
        </Link>
      </div>
    </Modal>
  )
}
