"use client";

import { useBrand } from "@/components/BrandProvider";

export function StaffFooter() {
  const { orgName } = useBrand();
  return (
    <footer className="print:hidden border-t border-[0.5px] border-salt-border mt-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <p className="text-center text-xs text-salt-text-muted">
          {orgName} · Laundry staff dashboard · Need help? Contact your supervisor.
        </p>
      </div>
    </footer>
  )
}
