import { ROOM_LOCK_HINTS } from '@/lib/constants/requestForm'
import type { LockedRoom } from '@/lib/types/guestOrder'

interface Props {
  room: LockedRoom
}

// The room is shown rather than asked for once something else has decided it:
// an edit (moving a request would hand it to a different guest) or a QR scan
// (the code was fixed to that room's door).
export function ReadOnlyRoomField({ room }: Props) {
  return (
    <div className="flex-1">
      <span className="block text-sm text-salt-text mb-1.5">Room number</span>
      <p className="text-sm text-salt-text py-2.5">{room.number}</p>
      <p className="text-xs text-salt-text-muted">{ROOM_LOCK_HINTS[room.reason]}</p>
    </div>
  )
}
