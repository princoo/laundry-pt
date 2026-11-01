import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { hasPermission } from "@/lib/utils/permissions";
import type { Permission } from "@/lib/constants/permissions";
import type { Session } from "next-auth";

function sessionPermissions(session: Session | null): string[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((session?.user as any)?.permissions ?? []) as string[];
}

// The only gate an API route needs. 401 with no session at all, 403 with a
// session that lacks this permission. The page that leads here carries the
// same check- hiding a nav link is not access control.
export async function requirePermission(permission: Permission) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasPermission(sessionPermissions(session), permission)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

// The acting user, for services that scope their queries to who is asking.
// `id` is null for a signed-in account that holds no laundry role yet- it has
// no mirror row, and no permission check lets it this far anyway.
export async function getCurrentUser() {
  const session = await auth();
  if (!session) return null;
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    id: (session.user as any).id as string,
    name: session.user?.name ?? "",
    email: session.user?.email ?? "",
    permissions: sessionPermissions(session),
    // When the access token runs out. Long-lived work- the notification
    // stream- reads it so it can end there and let the browser reconnect
    // with a refreshed session rather than outlive the person's roles.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expiresAt: ((session.user as any)?.expiresAt ?? null) as number | null,
  };
}
