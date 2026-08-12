import { NextResponse } from "next/server";
import { requireSoaApiKey } from "@/lib/utils/guards";
import {
  upsertFromSoa,
  EmailBelongsToAnotherUserError,
} from "@/services/soaUser.service";
import { soaUserSchema } from "@/lib/validations/soaUser.schema";

// SOA creates a staff account here. Retrying the same POST is a no-op that
// returns 200 rather than a duplicate or a 409- a provisioning call that
// cannot be safely retried is a provisioning call that eventually loses a user.
export async function POST(request: Request) {
  const keyError = requireSoaApiKey(request);
  if (keyError) return keyError;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = soaUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  try {
    const { user, created } = await upsertFromSoa(parsed.data);
    return NextResponse.json({ user }, { status: created ? 201 : 200 });
  } catch (error) {
    if (error instanceof EmailBelongsToAnotherUserError) {
      return NextResponse.json(
        {
          error:
            "That email address already belongs to a different SOA account",
        },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
