import NextAuth from "next-auth";
import type { JWT } from "next-auth/jwt";
import Keycloak from "next-auth/providers/keycloak";
import { decodeJwtPayload } from "@/lib/utils/jwt";
import {
  clientRoles,
  splitRoles,
  type KeycloakAccessClaims,
} from "@/lib/utils/keycloakRoles";
import { isExpired } from "@/lib/utils/sessionExpiry";
import { refreshAccessToken, type RefreshedTokens } from "@/lib/keycloakClient";
import { upsertFromToken } from "@/services/keycloakUser.service";
import {
  AUTHENTICATE_PATH,
  KEYCLOAK_CLIENT_ID,
  KEYCLOAK_ISSUER,
  KEYCLOAK_PROVIDER_ID,
  REFRESH_LEEWAY_SECONDS,
  SESSION_MAX_AGE_SECONDS,
  SESSION_REVALIDATE_SECONDS,
} from "@/lib/constants/auth";

const nowSeconds = () => Math.floor(Date.now() / 1000);

// Reads one set of tokens into the session JWT: who the person is, which
// soa.laundry roles they hold (permissions decide access, the rest is
// display), and the credentials needed to refresh. Runs at sign-in and after
// every refresh, so a role a reviewer assigns or removes in Keycloak lands
// within one access-token lifetime (5 minutes) without a sign-out.
//
// Returns null to refuse: Auth.js drops the session. The reason goes to the
// server log, never to the browser.
async function applyTokens(
  token: JWT,
  tokens: RefreshedTokens,
): Promise<JWT | null> {
  const claims = decodeJwtPayload<KeycloakAccessClaims>(tokens.accessToken);
  if (!claims?.sub) {
    console.error("[keycloak] access token carries no subject");
    return null;
  }

  const roles = clientRoles(claims, KEYCLOAK_CLIENT_ID);
  const { permissions, roleNames } = splitRoles(roles);

  let userId: string | null = null;
  try {
    const user = await upsertFromToken({
      keycloakId: claims.sub,
      email: claims.email ?? null,
      emailVerified: claims.email_verified === true,
      firstName: claims.given_name ?? null,
      lastName: claims.family_name ?? null,
      phoneNumber: claims.phone_number ?? null,
      roleNames,
      hasAccess: roles.length > 0,
    });
    userId = user?.id ?? null;
  } catch (error) {
    console.error(
      `[keycloak] could not mirror ${claims.sub}: ${(error as Error)?.message}`,
    );
    return null;
  }

  return Object.assign(token, {
    id: userId,
    keycloakId: claims.sub,
    email: claims.email ?? token.email,
    name: claims.name ?? token.name,
    roleNames,
    permissions,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    idToken: tokens.idToken,
    // The access token's own expiry, in seconds. The stream route reads it.
    expiresAt: tokens.expiresAt,
    // When Keycloak last confirmed this session and these roles.
    verifiedAt: nowSeconds(),
  });
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Keycloak({
      id: KEYCLOAK_PROVIDER_ID,
      clientId: KEYCLOAK_CLIENT_ID,
      issuer: KEYCLOAK_ISSUER,
      // A public client with PKCE, the shape of every client in the netiiv
      // realm (full scope off, no secret). Auth.js's Keycloak provider
      // assumes a confidential client unless told otherwise.
      client: { token_endpoint_auth_method: "none" },
      checks: ["pkce", "state"],
    }),
  ],
  session: { strategy: "jwt", maxAge: SESSION_MAX_AGE_SECONDS },
  // Behind Coolify's proxy in production, and NEXTAUTH_URL locally.
  trustHost: true,
  callbacks: {
    async jwt({ token, account, trigger }) {
      // Sign-in: Auth.js has just exchanged the code.
      if (account) {
        if (!account.access_token || typeof account.expires_at !== "number") {
          console.error("[keycloak] token response without an access token");
          return null;
        }
        return applyTokens(token, {
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          idToken: account.id_token,
          expiresAt: account.expires_at,
        });
      }

      // A cookie with no subject was minted before Keycloak owned sign-in.
      // It is not a session any more.
      if (!token.keycloakId) return null;

      // Refresh when the access token is about to run out, when Keycloak has
      // not been asked for SESSION_REVALIDATE_SECONDS, or when the browser asks
      // (useSession().update() from the no-access screen). Keycloak refusing
      // is the end of the session; a role change rides in on the new token.
      const expiring = isExpired(
        ((token.expiresAt as number | undefined) ?? 0) - REFRESH_LEEWAY_SECONDS,
      );
      const unverified =
        SESSION_REVALIDATE_SECONDS > 0 &&
        isExpired(
          ((token.verifiedAt as number | undefined) ?? 0) +
            SESSION_REVALIDATE_SECONDS,
        );
      if (trigger !== "update" && !expiring && !unverified) return token;
      if (typeof token.refreshToken !== "string") return null;

      const refreshed = await refreshAccessToken(token.refreshToken);
      if (!refreshed) return null;
      return applyTokens(token, refreshed);
    },
    session({ session, token }) {
      if (session.user) {
        // The tokens themselves stay in the cookie and never reach the browser
        // through here: useSession() receives exactly this object.
        Object.assign(session.user, {
          id: token.id ?? null,
          keycloakId: token.keycloakId,
          roleNames: token.roleNames ?? [],
          permissions: token.permissions ?? [],
          expiresAt: token.expiresAt ?? null,
        });
      }
      return session;
    },
  },
  // Where Auth.js sends an OAuth error: the page shows it and offers a retry
  // instead of starting another round trip.
  pages: { signIn: AUTHENTICATE_PATH },
});
