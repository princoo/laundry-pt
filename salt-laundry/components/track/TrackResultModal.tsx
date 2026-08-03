'use client'

import { Modal } from '@/components/ui/Modal'
import { TrackRequestDetail } from '@/components/track/TrackRequestDetail'
import type { TrackedRequest } from '@/lib/types/request'

interface Props {
  request: TrackedRequest
  onClose: () => void
}

export function TrackResultModal({ request, onClose }: Props) {
  return (
    <Modal title="Request details" onClose={onClose} maxWidthClass="max-w-2xl">
      <TrackRequestDetail request={request} />
    </Modal>
  )
}
