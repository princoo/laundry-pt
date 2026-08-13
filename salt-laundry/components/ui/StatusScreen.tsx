import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  // A large, faded number behind the title- "404", "500". Decorative.
  code?: string;
  title: string;
  message: string;
  // The way(s) out- links and buttons, styled by the caller.
  children: ReactNode;
}

// The full-screen frame every status page shares- 404, error, and the
// last-resort global error all sit inside it, so a broken page still feels like
// part of SALT. Plain (no hooks), so both the server not-found page and the
// client error boundary can render it.
export function StatusScreen({ code, title, message, children }: Props) {
  return (
    <div className="min-h-[100dvh] bg-salt-cream flex flex-col">
      <header className="px-4 sm:px-6 py-4">
        <Link
          href="/"
          aria-label="Salt of Akagera- home"
          className="inline-block"
        >
          <Image
            src="/salt-logo.png"
            alt="Salt of Akagera"
            width={80}
            height={34}
            priority
          />
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md text-center">
          {code && (
            <p className="text-[72px] sm:text-[88px] font-black leading-none text-salt-navy/15 select-none">
              {code}
            </p>
          )}
          <h1 className="text-[24px] sm:text-[28px] font-black text-salt-text mt-1">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-salt-text-sec leading-relaxed mt-3 max-w-[42ch] mx-auto">
            {message}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

// Shared action styles so every status page's buttons match.
export const STATUS_PRIMARY_ACTION =
  "inline-flex items-center justify-center gap-2 bg-salt-navy hover:bg-salt-navy-hover transition-colors text-white rounded-lg px-5 py-2.5 text-sm font-medium min-h-[44px]";

export const STATUS_SECONDARY_ACTION =
  "inline-flex items-center justify-center gap-2 bg-white text-salt-text border border-[0.5px] border-salt-border hover:bg-salt-cream transition-colors rounded-lg px-5 py-2.5 text-sm font-medium min-h-[44px]";
