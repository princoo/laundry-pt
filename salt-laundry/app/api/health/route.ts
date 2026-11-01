import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Liveness for the container's HEALTHCHECK and Coolify. Outside the proxy
// matcher, so it needs no session. The database round trip is deliberate: a
// container that answers but cannot reach its database is not healthy.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("[health] database unreachable:", (error as Error)?.message);
    return NextResponse.json(
      { status: "degraded", database: "unreachable" },
      { status: 503 },
    );
  }
}
