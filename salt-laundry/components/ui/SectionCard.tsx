import type { ReactNode } from 'react'

interface Props {
  title: string
  description?: string
  children: ReactNode
}

export function SectionCard({ title, description, children }: Props) {
  return (
    <section className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-5 sm:p-6">
      <div className="mb-4">
        <h2 className="text-[11px] uppercase tracking-wide text-salt-text-muted">{title}</h2>
        {description && <p className="text-sm text-salt-text-sec mt-1.5">{description}</p>}
      </div>
      {children}
    </section>
  )
}
