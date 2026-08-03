interface Props {
  reference: string
  room: string
  items?: string
}

export function ConfirmationCard({ reference, room, items }: Props) {
  const itemCount = Number(items ?? 0)

  return (
    <div className="mt-6 sm:mt-8 bg-white border border-[0.5px] border-salt-border rounded-xl shadow-sm p-6 sm:p-8 text-center">
      <p className="text-[11px] uppercase tracking-wide text-salt-text-muted">
        Your tracking reference
      </p>
      <p className="font-mono text-[26px] sm:text-[30px] tracking-wide text-salt-navy font-medium mt-2">
        {reference}
      </p>
      <p className="text-[12px] text-salt-text-muted mt-2">Keep this code to track your order</p>

      <div className="mt-6 pt-5 border-t-[0.5px] border-salt-border grid grid-cols-2 gap-4 text-left">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-salt-text-muted">Room</p>
          <p className="text-sm font-medium text-salt-text mt-1">{room}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-salt-text-muted">Items</p>
          <p className="text-sm font-medium text-salt-text mt-1">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </p>
        </div>
      </div>
    </div>
  )
}
