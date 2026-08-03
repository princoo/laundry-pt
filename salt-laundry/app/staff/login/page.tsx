import type { Metadata } from 'next'
import { AuthNav } from '@/components/ui/AuthNav'
import { StaffLoginForm } from '@/components/staff/StaffLoginForm'

export const metadata: Metadata = { title: 'Sign in' }

export default function StaffLoginPage() {
  return (
    <div className="min-h-screen bg-salt-cream flex flex-col">
      <AuthNav />

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm max-w-sm w-full p-6 sm:p-8">
          <p className="text-[12px] text-salt-text-muted">Staff portal</p>

          <div className="mt-6 pb-6 mb-6 border-b-[0.5px] border-salt-border">
            <h1 className="text-[22px] font-black text-salt-text">Sign in</h1>
            <p className="text-sm text-salt-text-sec mt-1">Manage laundry requests and assignments.</p>
          </div>

          <StaffLoginForm />
        </div>
      </div>
    </div>
  )
}
