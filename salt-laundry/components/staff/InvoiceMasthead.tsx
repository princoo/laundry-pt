"use client";

import { useBrand } from "@/components/BrandProvider";

interface Props {
  subtitle: string
}

export function InvoiceMasthead({ subtitle }: Props) {
  const { orgName } = useBrand();
  return (
    <div className="mb-8">
      <h1 className="text-[22px] sm:text-2xl font-black text-salt-text">{orgName}</h1>
      <div className="text-[11px] uppercase tracking-wide text-salt-text-muted mt-1.5">
        {subtitle}
      </div>
      <hr className="mt-5 border-t-[0.5px] border-salt-border" />
    </div>
  )
}
