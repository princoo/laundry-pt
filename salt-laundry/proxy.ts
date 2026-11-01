import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { AUTHENTICATE_PATH, REDIRECT_PARAM } from "@/lib/constants/auth";

// Signing in is Keycloak's job, so there is no public staff path left to let
// through- an unauthenticated page request goes to /authenticate, which
// starts the round trip and comes back to the path asked for.
//
// Running auth() here also refreshes a session whose access token is about
// to expire and writes the renewed cookie on the response, so every /staff
// page and staff API call downstream sees current roles.
export const proxy = auth((req) => {
  if (req.auth) return NextResponse.next();

  const { pathname, search } = req.nextUrl;

  // Data requests answer rather than redirect: the browser is already on a
  // page, and the shared fetch wrapper turns this into the redirect instead.
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const signInUrl = new URL(AUTHENTICATE_PATH, req.nextUrl.origin);
  signInUrl.searchParams.set(REDIRECT_PARAM, `${pathname}${search}`);
  return NextResponse.redirect(signInUrl);
});

// /authenticate and /api/auth are deliberately absent- they create the
// session, so guarding them with a session check would lock everyone out.
export const config = {
  matcher: [
    "/staff/:path*",
    "/api/staff/:path*",
    "/api/admin/:path*",
    "/api/supervisor/:path*",
  ],
};
