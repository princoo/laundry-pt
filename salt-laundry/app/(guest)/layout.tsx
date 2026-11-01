import type { Metadata } from "next";
import { getBrand } from "@/lib/brand";

// The guest form itself is a client component, which cannot export metadata,
// so the title for `/` lives here. This route group does not affect the URL.
export function generateMetadata(): Metadata {
  const { orgName } = getBrand();
  return {
    title: "Laundry Request",
    description:
      `Submit your laundry request at ${orgName}. ` +
      "Choose items, select service type, and we'll collect from your room.",
    openGraph: {
      title: `Laundry Request- ${orgName}`,
      description:
        "Submit your laundry request. We collect, clean, and return to your room.",
    },
  };
}

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
