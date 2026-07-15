import Link from 'next/link'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { GuestNav } from '@/components/guest/GuestNav'
import { GuestFooter } from '@/components/guest/GuestFooter'

interface Props {
  searchParams: Promise<{ reference?: string; room?: string; items?: string }>
}

export default async function ConfirmationPage({ searchParams }: Props) {
  const { reference, room, items } = await searchParams

  if (!reference || !room) {
    return (
      <div className="min-h-screen bg-salt-cream flex flex-col">
        <GuestNav active="new" />
        <div className="max-w-md mx-auto mt-16 px-4 text-center flex-1">
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

      <div className="max-w-md mx-auto mt-16 px-4 flex-1 w-full">
        <div className="w-16 h-16 rounded-full bg-salt-green-light flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-7 h-7 text-salt-green" />
        </div>

        <h1 className="text-[24px] font-black text-salt-text mt-6 text-center">Request received</h1>

        <p className="text-[14px] text-salt-text-sec text-center mt-2">
          A housekeeper has been assigned and will collect your items from room{' '}
          <span className="font-medium text-salt-text">{room}</span> shortly.
        </p>

        <div className="mt-6 bg-white border border-[0.5px] border-salt-border rounded-xl p-4 text-center">
          <p className="text-[11px] uppercase tracking-wide text-salt-text-muted">
            Your tracking reference
          </p>
          <p className="font-mono text-[22px] text-salt-navy font-medium mt-1">{reference}</p>
          <p className="text-[12px] text-salt-text-muted mt-1">
            Keep this code to track your order ({items ?? 0} items).
          </p>
        </div>

        <div className="mt-8 flex gap-3">
          <Link
            href={trackHref}
            className="flex-1 text-center bg-salt-navy hover:bg-salt-navy-hover transition-colors text-white rounded-lg py-3 font-medium flex items-center justify-center gap-1.5"
          >
            Track this order <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="flex-1 text-center border border-[0.5px] border-salt-navy text-salt-navy rounded-lg py-3 font-medium"
          >
            New request
          </Link>
        </div>
      </div>

      <GuestFooter />
    </div>
  )
}
