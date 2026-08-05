interface Props {
  roomNumber: string
}

// An edit shows the room rather than asking for it: moving a request to another
// room would hand it to a different guest.
export function ReadOnlyRoomField({ roomNumber }: Props) {
  return (
    <div className="flex-1">
      <span className="block text-sm text-salt-text mb-1.5">Room number</span>
      <p className="text-sm text-salt-text py-2.5">{roomNumber}</p>
      <p className="text-xs text-salt-text-muted">
        The room on a request can&apos;t be changed.
      </p>
    </div>
  )
}
