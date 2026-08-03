import type { ReactNode } from 'react'

interface Props {
  step: number
  title: string
  children: ReactNode
}

// Groups a set of fields under a numbered heading, so a multi-part form reads
// as a sequence instead of one flat list of inputs.
export function FormStep({ step, title, children }: Props) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2.5">
        <span className="w-5 h-5 shrink-0 rounded-full bg-salt-navy text-white text-[11px] flex items-center justify-center">
          {step}
        </span>
        <h2 className="text-sm font-medium text-salt-text">{title}</h2>
      </div>
      {children}
    </section>
  )
}
