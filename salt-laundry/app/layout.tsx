import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/lib/auth'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
})

export const metadata: Metadata = {
  title: 'SALT of Akagera — Laundry',
  description: 'Hotel laundry request system for SALT of Akagera',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return (
    <html lang="en" className={nunito.variable} suppressHydrationWarning>
      <body className="bg-salt-cream font-sans">
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  )
}
