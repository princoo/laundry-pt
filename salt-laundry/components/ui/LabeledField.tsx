import type { ReactNode } from 'react'

interface Props {
  label: string
  htmlFor?: string
  hint?: string
  children: ReactNode
}

export function LabeledField({ label, htmlFor, hint, children }: Props) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-xs font-medium text-salt-text-sec mb-1.5">
        {label}
        {hint && <span className="ml-1.5 font-normal text-salt-text-muted">{hint}</span>}
      </label>
      {children}
    </div>
  )
}
