import Link from 'next/link'

interface Props {
  // The dashboard is the right way out of most denied pages, but not out of a
  // denied dashboard — that would loop.
  backHref?: string
  backLabel?: string
}

// Shown in place of a page the session has no permission for. Which permission
// is missing is deliberately unnamed — it is not the user's to grant, and
// naming it only tells them what to go looking for.
export function AccessDenied({ backHref = '/staff', backLabel = 'Back to dashboard' }: Props) {
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-8 text-center">
        <p className="text-sm text-salt-text-sec">
          Access restricted. Your account cannot open this page — ask a supervisor if you
          need it.
        </p>
        <Link href={backHref} className="text-salt-navy text-sm underline mt-4 inline-block">
          ← {backLabel}
        </Link>
      </div>
    </div>
  )
}
