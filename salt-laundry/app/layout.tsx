import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";
import { getBrand } from "@/lib/brand";
import { BrandProvider } from "@/components/BrandProvider";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

// Every route renders at request time: the brand, the Keycloak client and the
// public origin come from the environment of the running container, and one
// image is built for every organization. Nothing here is worth prerendering
// against build-time values that would be wrong for the next deployment.
export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  const { orgName, appName, appUrl, locale } = getBrand();
  return {
    // Absolute base for the Open Graph image URL- without it Next.js falls
    // back to localhost, and the shared preview breaks in production.
    metadataBase: new URL(appUrl),

    // %s is replaced by each page's own title; pages with no title get the default
    title: {
      template: `%s | ${orgName}`,
      default: `${orgName}- Laundry Service`,
    },

    description:
      `Submit your hotel laundry request at ${orgName}. ` +
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
      locale,
      siteName: orgName,
      title: `${orgName}- Laundry Service`,
      description: `Hotel laundry request service at ${orgName}.`,
    },

    // Shown in browser bookmarks and history
    applicationName: appName,

    keywords: [orgName, "hotel laundry", "laundry service"],

    authors: [{ name: orgName }],
  };
}

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
        <BrandProvider brand={getBrand()}>
          <SessionProvider session={session}>{children}</SessionProvider>
        </BrandProvider>
      </body>
    </html>
  );
}
