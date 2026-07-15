import Link from 'next/link'

export function AdminAccessDenied() {
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-8 text-center">
        <p className="text-sm text-salt-text-sec">
          Access restricted. This page is for administrators only.
        </p>
        <Link href="/staff" className="text-salt-navy text-sm underline mt-4 inline-block">
          ← Back to dashboard
        </Link>
      </div>
    </div>
  )
}
