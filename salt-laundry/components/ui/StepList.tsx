import { Check } from 'lucide-react'

interface Props {
  steps: readonly string[]
  current: number
}

// Vertical progress rail. Markers match StatusStepper so a staff member reads
// it the same way they read request progress. Pass steps.length + 1 as current
// to mark the whole flow complete.
export function StepList({ steps, current }: Props) {
  return (
    <ol className="flex flex-col">
      {steps.map((label, index) => {
        const isDone = index + 1 < current
        const isCurrent = index + 1 === current
        const isLast = index === steps.length - 1

        return (
          <li key={label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 shrink-0 rounded-full border border-[0.5px] flex items-center justify-center ${
                  isDone || isCurrent ? 'bg-salt-navy border-salt-navy' : 'bg-white border-salt-border'
                }`}
              >
                {isDone && <Check className="w-3 h-3 text-white" />}
                {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              {!isLast && <div className="flex-1 my-1 border-l-[0.5px] border-salt-border" />}
            </div>
            <span
              className={`text-sm ${isLast ? '' : 'pb-5'} ${
                isCurrent
                  ? 'text-salt-navy font-medium'
                  : isDone
                    ? 'text-salt-text-sec'
                    : 'text-salt-text-muted'
              }`}
            >
              {label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
