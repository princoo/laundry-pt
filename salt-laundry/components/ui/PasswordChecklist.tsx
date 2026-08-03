import { Check, Circle } from 'lucide-react'
import type { PasswordCheck } from '@/lib/utils/password'

interface Props {
  checks: PasswordCheck[]
}

export function PasswordChecklist({ checks }: Props) {
  return (
    <ul className="flex flex-col gap-1.5" aria-live="polite">
      {checks.map((check) => (
        <li key={check.label} className="flex items-start gap-2 text-xs">
          {check.met ? (
            <Check className="w-3.5 h-3.5 shrink-0 mt-px text-salt-green" aria-hidden />
          ) : (
            <Circle className="w-3.5 h-3.5 shrink-0 mt-px text-salt-text-muted" aria-hidden />
          )}
          <span className={check.met ? 'text-salt-text-sec' : 'text-salt-text-muted'}>
            {check.label}
          </span>
        </li>
      ))}
    </ul>
  )
}
