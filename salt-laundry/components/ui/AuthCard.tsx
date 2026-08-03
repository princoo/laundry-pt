import type { ReactNode } from 'react'
import { BrandLogo } from '@/components/ui/BrandLogo'

interface Props {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}

// Shared shell for the standalone staff auth pages (sign in, forgot password,
// reset password, forced password change).
export function AuthCard({ title, subtitle, children, footer }: Props) {
  return (
    <div className="min-h-screen bg-salt-cream flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm max-w-sm w-full p-6 sm:p-8">
        <BrandLogo />
        <p className="text-[12px] text-salt-text-muted mt-2">Staff portal</p>

        <div className="mt-6 pb-6 mb-6 border-b-[0.5px] border-salt-border">
          <h1 className="text-[22px] font-black text-salt-text">{title}</h1>
          <p className="text-sm text-salt-text-sec mt-1">{subtitle}</p>
        </div>

        {children}
        {footer}
      </div>
    </div>
  )
}
