import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/utils/guards";
import { reorderItems } from "@/services/item.service";
import { reorderItemsSchema } from "@/lib/validations/item.schema";

// Persists a new catalogue order. The static `reorder` segment resolves ahead
// of the sibling `[id]` route, so this is never mistaken for an item id.
export async function PATCH(request: Request) {
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

  const parsed = reorderItemsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  try {
    await reorderItems(parsed.data.orderedIds);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
