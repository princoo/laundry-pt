import type { Metadata } from "next";
import { getRequestById } from "@/services/staffRequest.service";

// The page is a client component and cannot export generateMetadata,
// so the DB-derived title lives here. params is async in Next.js 16.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const request = await getRequestById(id);

  if (!request) return { title: "Request not found" };

  // Example output: "Room 214- J. Okafor- Collected | SALT Staff"
  return {
    title: `Room ${request.roomNumber}- ${
      request.guestName ? request.guestName + "- " : ""
    }${request.status.charAt(0) + request.status.slice(1).toLowerCase()}`,
  };
}

export default function RequestDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
