import type { Metadata } from 'next'

// The guest form itself is a client component, which cannot export metadata,
// so the title for `/` lives here. This route group does not affect the URL.
export const metadata: Metadata = {
  title: 'Laundry Request',
  description:
    'Submit your laundry request at SALT of Akagera. ' +
    "Choose items, select service type, and we'll collect from your room.",
  openGraph: {
    title: 'Laundry Request — SALT of Akagera',
    description: 'Submit your laundry request. We collect, clean, and return to your room.',
  },
}

export default function GuestLayout({ children }: { children: React.ReactNode }) {
  return children
}
