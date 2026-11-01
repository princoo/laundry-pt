"use client";

import Link from "next/link";
import { useBrand } from "@/components/BrandProvider";
import { HOME_NAV_LINK } from "@/lib/constants/navigation";

interface Props {
  className?: string;
}

// The logo is the way back to the guest home page from anywhere in the app-
// nav bars, auth screens, status pages, everywhere it appears. A plain <img>
// at a fixed height: the logo is configured per deployment and may be a
// remote URL, and the image optimizer is switched off (next.config.ts).
export function BrandLogo({ className = "" }: Props) {
  const { logoSrc, orgName } = useBrand();
  return (
    <Link
      href={HOME_NAV_LINK.href}
      aria-label={`${orgName}- home`}
      className={`inline-block ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logoSrc} alt={orgName} className="h-[34px] w-auto" />
    </Link>
  );
}
