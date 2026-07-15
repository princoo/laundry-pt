import { formatTimestamp } from '@/lib/utils/formatting'

interface Props {
  createdAt: string
  collectedAt: string | null
  completedAt: string | null
  returnedAt: string | null
}

function TimestampRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-xs text-salt-text-muted py-1">
      <span>{label}</span>
      <span>{formatTimestamp(value)}</span>
    </div>
  )
}

export function RequestTimestamps({ createdAt, collectedAt, completedAt, returnedAt }: Props) {
  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-4 mt-4">
      <TimestampRow label="Submitted" value={createdAt} />
      {collectedAt && <TimestampRow label="Collected" value={collectedAt} />}
      {completedAt && <TimestampRow label="Completed" value={completedAt} />}
      {returnedAt && <TimestampRow label="Returned" value={returnedAt} />}
    </div>
  )
}
