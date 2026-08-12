import { GuestNav } from '@/components/guest/GuestNav'
import { GuestFooter } from '@/components/guest/GuestFooter'
import { GuestFormHeader } from '@/components/guest/GuestFormHeader'
import { RequestForm } from '@/components/guest/RequestForm'
import {
  ActiveRequestDialog,
  type ActiveRequestSummary,
} from '@/components/guest/ActiveRequestDialog'
import { readRoomParam } from '@/lib/utils/roomParam'
import { getTrackableRequestsByRoom } from '@/services/trackRequest.service'
import { formatReference } from '@/lib/utils/formatting'

interface Props {
  searchParams: Promise<{ room?: string | string[] }>
}

// The room's QR code is the same sticker whether the guest is sending laundry or
// checking on laundry already sent, so arriving here does not mean they want a
// new request. Only a scanned room can be checked — a guest who has not told us
// their room yet has nothing to look up, and someone typing a room into the form
// is plainly mid-request already.
//
// Looked up here rather than in the form so the answer is settled before the
// first paint: the dialog arrives with the page instead of interrupting a form
// the guest has already started reading.
async function activeRequestsFor(room: string | undefined): Promise<ActiveRequestSummary[]> {
  if (!room) return []

  // Trackable means still with us — PENDING through READY. A delivered or
  // cancelled request is finished and must not stand in the way of a new one.
  const requests = await getTrackableRequestsByRoom(room)
  return requests.map((request) => ({
    reference: formatReference(request.seq, request.createdAt),
    status: request.status,
    totalItems: request.items.reduce((sum, item) => sum + item.quantity, 0),
  }))
}

export default async function Home({ searchParams }: Props) {
  const { room } = await searchParams
  const scannedRoom = readRoomParam(room)
  const activeRequests = await activeRequestsFor(scannedRoom)

  return (
    <div className="min-h-screen bg-salt-cream pb-24 md:pb-0 flex flex-col">
      <GuestNav active="new" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
        <GuestFormHeader />
        <RequestForm mode="create" scannedRoom={scannedRoom} />
      </div>

      {scannedRoom && (
        <ActiveRequestDialog room={scannedRoom} requests={activeRequests} />
      )}

      <GuestFooter />
    </div>
  )
}
