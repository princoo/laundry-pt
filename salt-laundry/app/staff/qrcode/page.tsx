'use client'

import { RoomQrWorkspace } from '@/components/staff/RoomQrWorkspace'
import { AccessDenied } from '@/components/ui/AccessDenied'
import { usePermissions } from '@/lib/hooks/usePermissions'

// Gated on the same permission the nav link filters by: hiding the link is not
// access control, so the page carries the check too and a deep link cannot
// bypass it.
export default function QrCodePage() {
  const { can, isLoading: isSessionLoading } = usePermissions()

  if (!isSessionLoading && !can('QR_CODE_GENERATION')) {
    return <AccessDenied />
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="print:hidden mb-6">
        <h1 className="text-[22px] font-black text-salt-text">Room QR codes</h1>
        <p className="text-sm text-salt-text-sec mt-1">
          Generate a printable QR code for a single room, or a full sheet for every room.
          Guests scan a code to open the laundry form with their room pre-filled.
        </p>
      </div>

      <RoomQrWorkspace />
    </div>
  )
}
