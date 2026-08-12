import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { soaSignInUrl } from "@/lib/utils/soaSignIn";

// Signing in is SOA's job now, so there is no public staff path left to let
// through- an unauthenticated page request leaves the app entirely.
export const proxy = auth((req) => {
  if (req.auth) return NextResponse.next();

  const { pathname, search } = req.nextUrl;

  // Data requests answer rather than redirect: the browser is already on a
  // page, and the shared fetch wrapper turns this into the redirect instead.
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const signInUrl = soaSignInUrl(`${pathname}${search}`);
  if (!signInUrl) {
    return new NextResponse("Sign-in is not configured.", { status: 500 });
  }
  return NextResponse.redirect(signInUrl);
});

// /authenticate is deliberately absent- it is the page that creates the
// session, so guarding it with a session check would lock everyone out.
export const config = {
  matcher: [
    "/staff/:path*",
    "/api/staff/:path*",
    "/api/admin/:path*",
    "/api/supervisor/:path*",
  ],
};
