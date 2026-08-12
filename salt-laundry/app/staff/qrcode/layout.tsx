import type { Metadata } from 'next'

// The page is a client component and cannot export metadata, so its title
// lives here. noindex and description are inherited from app/staff/layout.tsx.
export const metadata: Metadata = { title: 'Room QR codes' }

export default function QrCodeLayout({ children }: { children: React.ReactNode }) {
  return children
}
