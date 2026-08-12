import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { HOME_NAV_LINK } from "@/lib/constants/navigation";

// Minimal chrome for /authenticate, the one page outside both the guest form
// and the staff dashboard- just the way back out, nothing else.
export function AuthNav() {
  return (
    <nav className="bg-white border-b border-[0.5px] border-salt-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <BrandLogo />
        <Link
          href={HOME_NAV_LINK.href}
          className="flex items-center gap-1.5 text-sm text-salt-text-sec hover:text-salt-text transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </div>
    </nav>
  );
}
