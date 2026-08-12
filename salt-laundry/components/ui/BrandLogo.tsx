import Image from "next/image";
import Link from "next/link";
import { HOME_NAV_LINK } from "@/lib/constants/navigation";

interface Props {
  className?: string;
}

// The logo is the way back to the guest home page from anywhere in the app-
// nav bars, auth screens, everywhere it appears.
export function BrandLogo({ className = "" }: Props) {
  return (
    <Link
      href={HOME_NAV_LINK.href}
      aria-label="Salt of Akagera- home"
      className={`inline-block ${className}`}
    >
      <Image
        src="/salt-logo.png"
        alt="Salt of Akagera"
        width={80}
        height={34}
        priority
      />
    </Link>
  );
}
