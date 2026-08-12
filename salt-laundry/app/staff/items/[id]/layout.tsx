import type { Metadata } from "next";
import { getItemById } from "@/services/item.service";

// The page is a client component and cannot export generateMetadata,
// so the DB-derived title lives here. params is async in Next.js 16.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = await getItemById(id);

  return { title: item ? `Edit- ${item.nameEn}` : "Edit item" };
}

export default function ItemDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
