import type { MetadataRoute } from "next";
import { getBrand } from "@/lib/brand";

// Read at request time: the origin comes from the deployment's environment.
export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  // Confirmation page is intentionally excluded- it's not a destination.
  // Staff pages are intentionally excluded- they require authentication.
  return [
    {
      url: getBrand().appUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
