import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  // Absolute base for the Open Graph image URL- without it Next.js falls back
  // to localhost, and the shared preview breaks in production.
  metadataBase: new URL(process.env.APP_URL ?? "http://localhost:3000"),

  // %s is replaced by each page's own title; pages with no title get the default
  title: {
    template: "%s | SALT of Akagera",
    default: "SALT of Akagera- Laundry Service",
  },

  description:
    "Submit your hotel laundry request at SALT of Akagera. " +
    "We collect, clean, and return items to your room.",

  // Staff pages override this with a stronger noindex in app/staff/layout.tsx
  robots: {
    index: true,
    follow: true,
  },

  // Controls how the link looks when shared on WhatsApp, etc.
  // The image itself comes from app/opengraph-image.tsx- file-based metadata
  // always wins over an images array declared here, so it is not repeated.
  openGraph: {
    type: "website",
    locale: "en_RW",
    siteName: "SALT of Akagera",
    title: "SALT of Akagera- Laundry Service",
    description: "Hotel laundry request service at SALT of Akagera, Rwanda.",
  },

  // Shown in browser bookmarks and history
  applicationName: "SALT Laundry",

  keywords: [
    "SALT of Akagera",
    "hotel laundry",
    "Akagera",
    "Rwanda",
    "laundry service",
  ],

  authors: [{ name: "SALT of Akagera" }],
};

// Viewport is a separate export in Next.js 16 (not part of metadata)
export const viewport: Viewport = {
  themeColor: "#0d2137", // Navy- colours the browser chrome on mobile
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Prevents zoom on input focus on the guest form
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className={nunito.variable} suppressHydrationWarning>
      <body className="bg-salt-cream font-sans">
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
