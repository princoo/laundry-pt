'use client'

import { RoomQrWorkspace } from '@/components/staff/RoomQrWorkspace'

// Reachable by any authenticated staff member (linked from the main staff nav).
// proxy.ts already guards /staff/** behind a session.
export default function QrCodePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="print:hidden mb-6">
        <h1 className="text-xl font-bold text-salt-text">Room QR codes</h1>
        <p className="text-sm text-salt-text-sec mt-1">
          Generate a printable QR code for a single room, or a full sheet for every room.
          Guests scan a code to open the laundry form with their room pre-filled.
        </p>
      </div>

      <RoomQrWorkspace />
    </div>
  )
}
