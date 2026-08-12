import { NextResponse } from "next/server";
import { getCurrentUser, requirePermission } from "@/lib/utils/guards";
import {
  getRequestForStaffEdit,
  editStaffRequest,
  StaffRequestNotFoundError,
  StaffRequestNotEditableError,
} from "@/services/staffEdit.service";
import { ForbiddenRequestAccessError } from "@/services/requestStatus.service";
import { RequestValidationError } from "@/services/requestPricing.service";
import { editStaffRequestSchema } from "@/lib/validations/staffRequest.schema";

type RouteContext = { params: Promise<{ id: string }> };

// Staff correcting a request that has been flagged for changes. Distinct from
// /api/requests/[id]/edit, which is the public guest flow and must never be
// gated with this permission- see lib/constants/permissions.ts.
export async function GET(_request: Request, { params }: RouteContext) {
  const authError = await requirePermission("LAUNDRY_REQUEST_EDIT");
  if (authError) return authError;

  const { id } = await params;
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const found = await getRequestForStaffEdit(id, user);
    if (!found)
      return NextResponse.json(
        { error: "Request not found." },
        { status: 404 },
      );
    return NextResponse.json({ request: found });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const authError = await requirePermission("LAUNDRY_REQUEST_EDIT");
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

  const parsed = editStaffRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  try {
    return NextResponse.json(await editStaffRequest(id, parsed.data, user));
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
  if (error instanceof StaffRequestNotFoundError) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
  if (error instanceof StaffRequestNotEditableError) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
  if (error instanceof RequestValidationError) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
