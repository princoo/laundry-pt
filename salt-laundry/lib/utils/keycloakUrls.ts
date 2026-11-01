import {
  APP_URL,
  KEYCLOAK_CLIENT_ID,
  KEYCLOAK_ISSUER,
  KEYCLOAK_REALM,
  KEYCLOAK_URL,
} from "@/lib/constants/auth";

// The three Keycloak pages the laundry links to, built the way the other
// Netiiv applications build them (e-requisition-frontend, src/lib/keycloak.ts).

// The person's own account: names, phone, password, sessions, sign-in
// methods. `referrer_uri` is what the console's "back to the application"
// link uses; it must sit under one of the client's redirect URIs.
export function accountConsoleUrl(returnPath = "/staff/profile"): string {
  if (!KEYCLOAK_ISSUER) return "";
  const url = new URL(`${KEYCLOAK_ISSUER}/account`);
  url.searchParams.set("referrer", KEYCLOAK_CLIENT_ID);
  if (APP_URL) url.searchParams.set("referrer_uri", `${APP_URL}${returnPath}`);
  return url.toString();
}

// The realm's own admin console, where USER_ADMIN holders review
// registrations and assign this client's roles. Not /admin/ alone- that is
// the master realm's console and refuses them.
export function adminConsoleUrl(): string {
  if (!KEYCLOAK_URL) return "";
  return `${KEYCLOAK_URL}/admin/${encodeURIComponent(KEYCLOAK_REALM)}/console/`;
}

// Ends the Keycloak SSO session (every Netiiv application at once) and comes
// back to `postLogoutRedirect`, which must match the client's post-logout
// URIs. With an ID token hint Keycloak signs out without asking; without one
// it shows a confirmation page first.
export function endSessionUrl(
  idToken: string | undefined,
  postLogoutRedirect: string,
): string {
  const url = new URL(`${KEYCLOAK_ISSUER}/protocol/openid-connect/logout`);
  if (idToken) url.searchParams.set("id_token_hint", idToken);
  else url.searchParams.set("client_id", KEYCLOAK_CLIENT_ID);
  url.searchParams.set("post_logout_redirect_uri", postLogoutRedirect);
  return url.toString();
}
