'use client'

import { useRef, useState } from 'react'
import { Check, Copy, Download, Printer } from 'lucide-react'
import { SectionCard } from '@/components/ui/SectionCard'
import { LabeledField } from '@/components/ui/LabeledField'
import { RoomQrCard } from '@/components/staff/RoomQrCard'
import { useRoomQrCode } from '@/lib/hooks/useRoomQrCode'
import { useCardImageExport } from '@/lib/hooks/useCardImageExport'
import { buildGuestRoomUrl, MAX_ROOM_LENGTH } from '@/lib/utils/roomParam'
import { isAllowedRoom, ALLOWED_ROOMS } from '@/lib/constants/rooms'
import { INPUT_CLASSES } from '@/lib/constants/formStyles'

const BUTTON =
  'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

export function RoomQrGenerator() {
  const [room, setRoom] = useState('')
  const [copied, setCopied] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const trimmed = room.trim()
  const allowed = isAllowedRoom(trimmed)
  const invalid = trimmed.length > 0 && !allowed
  // Only a real, bookable room gets a code — a QR for a room that doesn't exist
  // would just send a guest to a dead form.
  const url = allowed ? buildGuestRoomUrl(trimmed) : null

  const { containerRef, ready } = useRoomQrCode(url)
  const { exportPng, exporting } = useCardImageExport(cardRef)
  const canAct = !!url && ready

  const fileName = `room-${trimmed || 'code'}-qr`

  async function copyUrl() {
    if (!url) return
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
      {/* Controls — never printed. */}
      <div className="print:hidden space-y-6">
        <SectionCard
          title="Room"
          description="Enter a room number to generate its QR code. Guests scan it to open the laundry form with the room already filled in."
        >
          <LabeledField label="Room number">
            <input
              id="qr-room"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              autoFocus
              list="allowed-rooms"
              maxLength={MAX_ROOM_LENGTH}
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="e.g. 131"
              className={INPUT_CLASSES}
            />
            <datalist id="allowed-rooms">
              {ALLOWED_ROOMS.map((r) => (
                <option key={r} value={r} />
              ))}
            </datalist>
          </LabeledField>

          {invalid && (
            <p className="mt-2 text-sm text-red-700">
              {`Room ${trimmed} isn't a bookable room, so it has no QR code.`}
            </p>
          )}

          {url && (
            <div className="mt-4">
              <p className="text-xs font-medium text-salt-text-sec mb-1.5">Encoded link</p>
              <p className="text-sm text-salt-navy break-all bg-salt-cream rounded-lg px-3 py-2">
                {url}
              </p>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={copyUrl}
              disabled={!url}
              className={`${BUTTON} bg-white text-salt-text border border-[0.5px] border-salt-border hover:bg-salt-cream`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy link'}
            </button>
            <button
              type="button"
              onClick={() => exportPng(fileName)}
              disabled={!canAct || exporting}
              className={`${BUTTON} bg-salt-navy hover:bg-salt-navy-hover text-white`}
            >
              <Download className="w-4 h-4" />
              {exporting ? 'Preparing…' : 'Download PNG'}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              disabled={!url}
              className={`${BUTTON} bg-white text-salt-text border border-[0.5px] border-salt-border hover:bg-salt-cream`}
            >
              <Printer className="w-4 h-4" />
              Print card
            </button>
          </div>
        </SectionCard>
      </div>

      {/* Printable / exportable card. */}
      <div className="lg:w-[340px] print:mx-auto">
        <RoomQrCard room={trimmed} url={url} containerRef={containerRef} cardRef={cardRef} />
      </div>
    </div>
  )
}
