import type { Metadata } from 'next'

// The page is a client component and cannot export metadata, so the title
// lives here — same shell as every other staff route.
export const metadata: Metadata = { title: 'Correct request' }

export default function StaffEditRequestLayout({ children }: { children: React.ReactNode }) {
  return children
}
