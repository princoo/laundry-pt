import type { ReactNode } from 'react'
import { AuthNav } from '@/components/ui/AuthNav'

interface Props {
  title: string
  description: string
  aside?: ReactNode
  children: ReactNode
}

// Two-column frame for the standalone staff auth pages: context on the left,
// the form card on the right, single column below lg.
export function AuthShell({ title, description, aside, children }: Props) {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <AuthNav />

      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 py-10 sm:py-14">
        <div className="w-full max-w-5xl mx-auto grid gap-8 lg:gap-16 lg:grid-cols-[minmax(0,1fr)_25rem] lg:items-center">
          <div className="lg:max-w-md">
            <p className="text-[12px] text-salt-text-muted">Staff portal</p>

            <h1 className="text-[24px] sm:text-[30px] font-black text-salt-text leading-tight mt-6">
              {title}
            </h1>
            <p className="text-sm sm:text-base text-salt-text-sec leading-relaxed mt-3 max-w-[46ch]">
              {description}
            </p>

            {aside && <div className="mt-6 pt-6 border-t-[0.5px] border-salt-border">{aside}</div>}
          </div>

          <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-5 sm:p-7">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
