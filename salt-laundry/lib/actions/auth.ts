"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getToken } from "next-auth/jwt";
import { signIn, signOut } from "@/lib/auth";
import { safeRedirectTarget } from "@/lib/utils/redirectTarget";
import { endSessionUrl } from "@/lib/utils/keycloakUrls";
import {
  APP_URL,
  KEYCLOAK_ISSUER,
  KEYCLOAK_PROVIDER_ID,
} from "@/lib/constants/auth";

// Starts the authorization-code flow: Auth.js writes the PKCE and state
// cookies and redirects to Keycloak's login page, which comes back to
// /api/auth/callback/keycloak and then to `callbackUrl`. A server action,
// because only actions and route handlers may set cookies.
export async function startSignIn(callbackUrl: string | null) {
  await signIn(KEYCLOAK_PROVIDER_ID, {
    redirectTo: safeRedirectTarget(callbackUrl),
  });
}

// Signs out of the laundry and of the Netiiv Account in one go, the way the
// other Netiiv applications do: Keycloak's end-session endpoint with the ID
// token as a hint, back to the guest form afterwards. Clearing only the local
// cookie would sign the person straight back in on the next click, since the
// SSO session would still be alive.
export async function signOutEverywhere() {
  const requestHeaders = await headers();
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  const secureCookie =
    (requestHeaders.get("x-forwarded-proto") ?? "http") === "https";
  const token = secret
    ? await getToken({ req: { headers: requestHeaders }, secret, secureCookie })
    : null;

  await signOut({ redirect: false });

  // Nothing to end at Keycloak if it is not configured: just leave.
  if (!KEYCLOAK_ISSUER || !APP_URL) redirect("/");
  redirect(
    endSessionUrl(
      typeof token?.idToken === "string" ? token.idToken : undefined,
      `${APP_URL}/`,
    ),
  );
}
