'use client'

interface Props {
  room: string
  onRoomChange: (value: string) => void
  onSearch: () => void
  isLoading: boolean
}

export function RoomInvoiceSearchForm({ room, onRoomChange, onSearch, isLoading }: Props) {
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSearch() }}
      className="print:hidden flex items-end gap-3 mb-8"
    >
      <div className="flex flex-col gap-1">
        <label className="text-xs text-salt-text-muted">Room number</label>
        <input
          value={room}
          onChange={(e) => onRoomChange(e.target.value)}
          placeholder="e.g. 204"
          className="border border-[0.5px] border-salt-border rounded-lg px-3 py-2 text-sm w-40"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !room.trim()}
        className="bg-salt-navy hover:bg-salt-navy-hover transition-colors text-white text-sm font-medium rounded-lg px-5 py-2 disabled:opacity-50"
      >
        {isLoading ? 'Generating…' : 'Generate invoice'}
      </button>
    </form>
  )
}
