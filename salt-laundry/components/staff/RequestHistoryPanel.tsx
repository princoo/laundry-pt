import { History, Plus, Minus, PencilLine } from 'lucide-react'
import { formatCurrency, formatEventTimestamp } from '@/lib/utils/formatting'
import type { LineChange, RequestChange } from '@/lib/utils/requestHistory'

interface Props {
  changes: RequestChange[]
}

// Kept deliberately plain: this is a record, not a dashboard. Amber/green/red
// would imply some edits are alarming and others fine, which is not something
// the data knows.
const KIND_ICON: Record<LineChange['kind'], typeof Plus> = {
  added: Plus,
  removed: Minus,
  edited: PencilLine,
}

const KIND_CLASS: Record<LineChange['kind'], string> = {
  added: 'text-salt-green',
  removed: 'text-red-600',
  edited: 'text-salt-text-sec',
}

export function RequestHistoryPanel({ changes }: Props) {
  if (changes.length === 0) return null

  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-4 sm:p-6">
      <div className="text-xs font-medium text-salt-text-sec mb-3 flex items-center gap-1.5">
        <History className="w-3.5 h-3.5" />
        Change history
      </div>

      <div className="flex flex-col gap-4">
        {changes.map((change, index) => (
          <div
            key={index}
            className="border-l-2 border-salt-border pl-3 flex flex-col gap-1.5"
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-xs font-medium text-salt-text">
                {change.editedBy ?? 'Guest'}
              </span>
              <span className="text-[11px] text-salt-text-muted shrink-0">
                {formatEventTimestamp(change.at)}
              </span>
            </div>

            {change.reason && (
              <p className="text-xs text-salt-text-sec italic">{change.reason}</p>
            )}

            {change.lines.map((line, i) => {
              const Icon = KIND_ICON[line.kind]
              return (
                <div key={i} className="flex gap-1.5 text-xs text-salt-text-sec">
                  <Icon className={`w-3 h-3 shrink-0 mt-0.5 ${KIND_CLASS[line.kind]}`} />
                  <span>
                    <span className="text-salt-text">{line.nameEn}</span>
                    {' — '}
                    {line.details.join(', ')}
                  </span>
                </div>
              )
            })}

            {change.fields.map((field, i) => (
              <div key={i} className="text-xs text-salt-text-sec pl-[18px]">
                {field.label}: {field.from} → {field.to}
              </div>
            ))}

            {change.totalFrom !== change.totalTo && (
              <div className="text-xs text-salt-text pl-[18px]">
                Total {formatCurrency(change.totalFrom)} → {formatCurrency(change.totalTo)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
