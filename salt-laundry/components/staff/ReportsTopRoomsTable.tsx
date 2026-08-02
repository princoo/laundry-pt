import { formatCurrency } from '@/lib/utils/formatting'
import type { ReportRoomStat } from '@/lib/types/report'

interface Props {
  rooms: ReportRoomStat[]
}

export function ReportsTopRoomsTable({ rooms }: Props) {
  return (
    <div>
      <h2 className="text-sm font-medium text-salt-text mb-3">Highest-spend rooms</h2>
      <table className="w-full text-sm bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm overflow-hidden">
        <thead>
          <tr className="bg-salt-cream text-salt-text-muted text-xs uppercase">
            <th className="py-3 px-4 text-left font-medium">Room</th>
            <th className="py-3 px-4 text-left font-medium">Total (RWF)</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.room} className="border-t border-[0.5px] border-salt-border">
              <td className="py-2.5 px-4">{room.room}</td>
              <td className="py-2.5 px-4">{formatCurrency(room.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
