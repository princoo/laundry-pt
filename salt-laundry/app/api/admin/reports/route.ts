import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/utils/guards";
import { generateReport } from "@/services/report.service";
import { parseHotelDayStart, parseHotelDayEnd } from "@/lib/utils/hotelTime";

export async function GET(request: Request) {
  const authError = await requirePermission("LAUNDRY_REPORTS_VIEW");
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  if (!fromParam || !toParam) {
    return NextResponse.json(
      { error: "from and to are required" },
      { status: 400 },
    );
  }

  // Both ends resolved in hotel time. Previously `from` was parsed as UTC
  // midnight while `to` was pushed to 23:59 in the server's timezone- so on a
  // UTC host the range began two hours into the previous Kigali day and ended
  // two hours short of the one that was asked for.
  const from = parseHotelDayStart(fromParam);
  const to = parseHotelDayEnd(toParam);
  if (!from || !to) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }
  if (from > to) {
    return NextResponse.json(
      { error: "from must be before or equal to to" },
      { status: 400 },
    );
  }

  const report = await generateReport({ from, to });
  return NextResponse.json(report);
}
