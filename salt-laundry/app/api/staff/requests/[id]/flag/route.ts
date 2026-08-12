import { NextResponse } from "next/server";
import { getCurrentUser, requirePermission } from "@/lib/utils/guards";
import {
  flagRequest,
  unflagRequest,
  RequestNotFlaggableError,
} from "@/services/requestFlag.service";
import { ForbiddenRequestAccessError } from "@/services/requestStatus.service";
import { flagRequestSchema } from "@/lib/validations/requestFlag.schema";

type RouteContext = { params: Promise<{ id: string }> };

// Two different permissions on purpose. Spotting that the bag does not match
// the list is the job of whoever collects it, so flagging rides on the same
// permission as advancing the request. Acting on the flag- correcting the
// order, or deciding no correction is needed- is LAUNDRY_REQUEST_EDIT.
export async function POST(request: Request, { params }: RouteContext) {
  const authError = await requirePermission("LAUNDRY_REQUEST_PROCESS");
  if (authError) return authError;

  const { id } = await params;
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = flagRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  try {
    const flagged = await flagRequest(id, parsed.data.reason, user);
    if (!flagged)
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    return NextResponse.json(flagged);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const authError = await requirePermission("LAUNDRY_REQUEST_EDIT");
  if (authError) return authError;

  const { id } = await params;
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const cleared = await unflagRequest(id, user);
    if (!cleared)
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    return NextResponse.json(cleared);
  } catch (error) {
    return errorResponse(error);
  }
}

function errorResponse(error: unknown) {
  if (error instanceof ForbiddenRequestAccessError) {
    return NextResponse.json(
      { error: "You can only change requests assigned to you" },
      { status: 403 },
    );
  }
  if (error instanceof RequestNotFlaggableError) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
