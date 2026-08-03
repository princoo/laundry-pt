import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { GuestNav } from '@/components/guest/GuestNav'
import { GuestFooter } from '@/components/guest/GuestFooter'
import { ConfirmationCard } from '@/components/guest/ConfirmationCard'
import { ConfirmationActions } from '@/components/guest/ConfirmationActions'

export const metadata: Metadata = {
  // No Open Graph — confirmation pages are not shared, and not indexed
  title: 'Request Submitted',
  robots: { index: false, follow: false },
}

interface Props {
  searchParams: Promise<{ reference?: string; room?: string; items?: string }>
}

export default async function ConfirmationPage({ searchParams }: Props) {
  const { reference, room, items } = await searchParams

  if (!reference || !room) {
    return (
      <div className="min-h-screen bg-salt-cream flex flex-col">
        <GuestNav active="new" />
        <div className="max-w-md mx-auto px-4 flex-1 flex flex-col items-center justify-center text-center">
          <p className="text-sm text-salt-text-sec">Request not found.</p>
          <Link href="/" className="text-sm text-salt-navy font-medium mt-4 inline-block">
            Back to form
          </Link>
        </div>
        <GuestFooter />
      </div>
    )
  }

  const trackHref = `/track?room=${encodeURIComponent(room)}&reference=${encodeURIComponent(reference)}`

  return (
    <div className="min-h-screen bg-salt-cream flex flex-col">
      <GuestNav active="new" />

      <div className="max-w-md mx-auto px-4 flex-1 w-full flex flex-col justify-center py-10 sm:py-16">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-salt-green-light flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-7 h-7 sm:w-9 sm:h-9 text-salt-green" />
        </div>

        <h1 className="text-[22px] sm:text-[26px] font-black text-salt-text mt-5 sm:mt-6 text-center">
          Request received
        </h1>

        <p className="text-[14px] text-salt-text-sec text-center mt-2 max-w-sm mx-auto">
          A housekeeper has been assigned and will collect your items from room{' '}
          <span className="font-medium text-salt-text">{room}</span> shortly.
        </p>

        <ConfirmationCard reference={reference} room={room} items={items} />

        <ConfirmationActions trackHref={trackHref} />
      </div>

      <GuestFooter />
    </div>
  )
}
