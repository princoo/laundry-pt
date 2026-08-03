import { formatTimestamp } from '@/lib/utils/formatting'

interface Props {
  createdAt: string
  collectedAt: string | null
  completedAt: string | null
  returnedAt: string | null
}

export function RequestTimestamps({ createdAt, collectedAt, completedAt, returnedAt }: Props) {
  const rows = (
    [
      { label: 'Submitted', value: createdAt },
      { label: 'Collected', value: collectedAt },
      { label: 'Completed', value: completedAt },
      { label: 'Returned', value: returnedAt },
    ] as { label: string; value: string | null }[]
  ).filter((row): row is { label: string; value: string } => Boolean(row.value))

  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-4 sm:p-6">
      <div className="text-[11px] uppercase text-salt-text-muted mb-4">Timeline</div>
      <ol>
        {rows.map((row, index) => (
          <li key={row.label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-salt-navy mt-1 shrink-0" />
              {index < rows.length - 1 && <span className="w-px flex-1 bg-salt-border" />}
            </div>
            <div className={index < rows.length - 1 ? 'pb-3' : ''}>
              <div className="text-xs text-salt-text">{row.label}</div>
              <div className="text-[11px] text-salt-text-muted mt-0.5">{formatTimestamp(row.value)}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
