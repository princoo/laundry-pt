"use client";

import { createContext, useContext, type ReactNode } from "react";
import { DEFAULT_BRAND, type Brand } from "@/lib/constants/brand";

// Carries the deployment's identity from the root layout (which reads the
// environment on the server) to every client component. The default covers
// the one tree rendered outside the root layout, app/global-error.tsx.
const BrandContext = createContext<Brand>(DEFAULT_BRAND);

export function BrandProvider({
  brand,
  children,
}: {
  brand: Brand;
  children: ReactNode;
}) {
  return <BrandContext.Provider value={brand}>{children}</BrandContext.Provider>;
}

export function useBrand(): Brand {
  return useContext(BrandContext);
}
