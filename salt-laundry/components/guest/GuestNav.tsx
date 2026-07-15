import Image from 'next/image'
import { Shirt } from 'lucide-react'
import { NavLink } from '@/components/ui/NavLink'

interface Props {
  active: 'new' | 'track'
}

export function GuestNav({ active }: Props) {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[0.5px] border-salt-border">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image src="/salt-logo.png" alt="Salt of Akagera" width={80} height={34} priority />
          <div className="h-8 w-px bg-salt-border" />
          <div className="flex items-center gap-2">
            <Shirt className="w-6 h-6 text-salt-green" />
            <span className="text-salt-navy text-lg font-black">Laundry Service</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <NavLink href="/" active={active === 'new'}>New request</NavLink>
          <NavLink href="/track" active={active === 'track'}>Track order</NavLink>
        </div>
      </div>
    </nav>
  )
}
