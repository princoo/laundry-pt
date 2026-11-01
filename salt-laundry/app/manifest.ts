import type { MetadataRoute } from "next";
import { getBrand } from "@/lib/brand";

// Read at request time: the name comes from the deployment's environment.
export const dynamic = "force-dynamic";

// Makes the dashboard installable on staff tablets and phones.
export default function manifest(): MetadataRoute.Manifest {
  const { orgName, appName } = getBrand();
  return {
    name: `${orgName}- Laundry`,
    short_name: appName,
    description: `Hotel laundry management for ${orgName} staff`,
    start_url: "/staff",
    display: "standalone", // Hides browser chrome when installed
    background_color: "#f5f4f1", // Cream- shown during splash screen
    theme_color: "#0d2137", // Navy- matches the nav bar
    orientation: "portrait",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
