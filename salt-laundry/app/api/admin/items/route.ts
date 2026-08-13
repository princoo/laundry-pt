import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/utils/guards";
import { getAllItems, createItem } from "@/services/item.service";
import { createItemSchema } from "@/lib/validations/item.schema";

// The /api/admin prefix is a leftover- "admin" is no longer a concept. Renaming
// the path is churn that would collide with the rest of the permission work, so
// it stays until a later phase.
//
// Returns the whole catalogue, unpaged: the page is a single drag-to-reorder
// list, and the catalogue is small and bounded.
export async function GET() {
  const authError = await requirePermission(
    "LAUNDRY_REQUEST_ITEMS_CATALOGUE_VIEW",
  );
  if (authError) return authError;

  const { items, total, activeCount } = await getAllItems();
  return NextResponse.json({ items, total, activeCount });
}

export async function POST(request: Request) {
  const authError = await requirePermission(
    "LAUNDRY_REQUEST_ITEMS_CATALOGUE_MANAGE",
  );
  if (authError) return authError;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  try {
    const item = await createItem(parsed.data);
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
