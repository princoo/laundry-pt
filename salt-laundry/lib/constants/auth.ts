// Where the Netiiv Account (Keycloak) lives and which of its clients this app
// is. Configuration, never literals: the same build runs against the local
// stack (http://localhost:8180) and https://account.netiiv.com. Empty means
// "not configured", and the sign-in page says so instead of redirecting to a
// half-built URL.
export const KEYCLOAK_URL = (process.env.KEYCLOAK_URL ?? "").replace(/\/+$/, "");
export const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM ?? "netiiv";
// <organization>.<application>, the realm's naming convention.
export const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID ?? "soa.laundry";
export const KEYCLOAK_ISSUER = KEYCLOAK_URL
  ? `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}`
  : "";

// This app's public origin: post-logout and account-console return addresses
// are built from it and must match the client's redirect URIs in Keycloak.
export const APP_URL = (process.env.APP_URL ?? "").replace(/\/+$/, "");

// The Auth.js provider id, shared by the config and the server action that
// starts a sign-in.
export const KEYCLOAK_PROVIDER_ID = "keycloak";

// Ours: the page that starts a sign-in and the parameter carrying the path to
// return to. proxy.ts, the page and the action agree on them here.
export const AUTHENTICATE_PATH = "/authenticate";
export const REDIRECT_PARAM = "callbackUrl";
export const SIGNED_IN_HOME = "/staff";

// Outer bound on the session cookie: the realm's SSO session lives 24 hours
// at most. The session usually ends earlier, the moment Keycloak refuses to
// refresh the access token (sign-out elsewhere, account disabled, 8 hours
// idle).
export const SESSION_MAX_AGE_SECONDS = 24 * 60 * 60;

// Refresh this long before the access token (5 minutes on the realm) runs
// out, so a request in flight never carries one that has just expired.
export const REFRESH_LEEWAY_SECONDS = 30;

// How long the laundry trusts its own cookie before asking Keycloak again.
// Keycloak is the source of truth for both "is this person still signed in"
// and "what may they do", and the only way to learn either is to refresh the
// token: a session deleted in the admin console refuses the refresh and ends
// here; a role change arrives in the new token. Ten seconds keeps a page
// refresh honest at the cost of at most one token call per person per window.
// 0 means "only near expiry", the plain OIDC behaviour.
export const SESSION_REVALIDATE_SECONDS = Math.max(
  0,
  Number(process.env.SESSION_REVALIDATE_SECONDS ?? 10) || 0,
);
