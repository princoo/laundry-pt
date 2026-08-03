import { formatCurrency } from '@/lib/utils/formatting'
import type { ReportRoomStat } from '@/lib/types/report'

interface Props {
  rooms: ReportRoomStat[]
}

export function ReportsTopRoomsTable({ rooms }: Props) {
  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm overflow-hidden">
      <h2 className="text-sm font-medium text-salt-text px-5 pt-4 pb-3">Highest-spend rooms</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-salt-cream text-salt-text-muted text-xs border-t border-[0.5px] border-salt-border">
            <th className="py-2.5 px-5 text-left font-medium">Room</th>
            <th className="py-2.5 px-5 text-left font-medium">Total (RWF)</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.room} className="border-t border-[0.5px] border-salt-border">
              <td className="py-2.5 px-5">{room.room}</td>
              <td className="py-2.5 px-5">{formatCurrency(room.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
