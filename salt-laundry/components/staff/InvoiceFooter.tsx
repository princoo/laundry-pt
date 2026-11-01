"use client";

import { useBrand } from "@/components/BrandProvider";

export function InvoiceFooter() {
  const { orgName, address } = useBrand();
  return (
    <div className="mt-10 pt-6 border-t-[0.5px] border-salt-border text-center text-[13px] text-salt-text-sec">
      <p>Thank you for choosing {orgName}.</p>
      <p>This invoice serves as confirmation of laundry services rendered.</p>
      <p className="text-[11px] text-salt-text-muted mt-3">
        {orgName} · {address}
      </p>
    </div>
  )
}
