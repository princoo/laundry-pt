import { Check, Info } from 'lucide-react'
import type { ReactNode } from 'react'

interface Props {
  tone?: 'success' | 'neutral'
  title: string
  body: ReactNode
  children?: ReactNode
}

const TONES = {
  success: { disc: 'bg-salt-green-light', icon: 'text-salt-green' },
  neutral: { disc: 'bg-salt-cream', icon: 'text-salt-navy' },
} as const

// Terminal state inside an auth card: link sent, password updated, link dead.
// children carries the next action so the user never ends on a text link.
export function AuthNotice({ tone = 'success', title, body, children }: Props) {
  const Icon = tone === 'success' ? Check : Info

  return (
    <div className="flex flex-col gap-4">
      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${TONES[tone].disc}`}>
        <Icon className={`w-4 h-4 ${TONES[tone].icon}`} />
      </div>
      <div>
        <h2 className="text-base font-medium text-salt-text">{title}</h2>
        <p className="text-sm text-salt-text-sec leading-relaxed mt-1.5">{body}</p>
      </div>
      {children}
    </div>
  )
}
