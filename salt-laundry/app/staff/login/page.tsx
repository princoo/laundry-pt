import Image from 'next/image'
import { StaffLoginForm } from '@/components/staff/StaffLoginForm'

export default function StaffLoginPage() {
  return (
    <div className="min-h-screen bg-salt-cream flex items-center justify-center">
      <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm max-w-sm w-full mx-auto p-8">
        <Image src="/salt-logo.png" alt="Salt of Akagera" width={80} height={34} priority />
        <p className="text-[12px] text-salt-text-muted mt-2">Staff portal</p>

        <h1 className="text-[22px] font-black text-salt-text mt-6 mb-6">Sign in</h1>

        <StaffLoginForm />
      </div>
    </div>
  )
}
