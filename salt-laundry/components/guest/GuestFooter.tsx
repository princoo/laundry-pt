"use client";

import { useBrand } from "@/components/BrandProvider";

export function GuestFooter() {
  const { orgName, helpLine } = useBrand();
  return (
    <footer className="border-t border-[0.5px] border-salt-border mt-12">
      <p className="text-center text-xs text-salt-text-muted py-6">
        {orgName} · Laundry &amp; Dry-cleaning · {helpLine}
      </p>
    </footer>
  )
}
