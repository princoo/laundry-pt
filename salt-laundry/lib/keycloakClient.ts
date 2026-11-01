import { KEYCLOAK_CLIENT_ID, KEYCLOAK_ISSUER } from "@/lib/constants/auth";

// The one call the laundry makes to Keycloak outside Auth.js: trading the
// refresh token for a new access token, so the session follows the person's
// roles and their SSO session instead of a fixed timer. It is a fetch, so it
// cannot live in services/- that layer is Prisma only.
//
// Every failure answers null, which the jwt callback turns into "no session":
// a refused refresh is exactly how Keycloak says the SSO session is over or
// the account is disabled. The reason goes to the server log.
//
// Nothing here logs a token: all three are live credentials.
const TIMEOUT_MS = 8000;

export interface RefreshedTokens {
  accessToken: string;
  refreshToken: string | undefined;
  idToken: string | undefined;
  // Unix seconds. The realm issues 5-minute access tokens.
  expiresAt: number;
}

export async function refreshAccessToken(
  refreshToken: string,
): Promise<RefreshedTokens | null> {
  if (!KEYCLOAK_ISSUER) {
    console.error("[keycloak] KEYCLOAK_URL is not set- cannot refresh a session");
    return null;
  }

  // A public client, like every other Netiiv client: no secret, PKCE at
  // sign-in, and the refresh token alone on the back channel.
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: KEYCLOAK_CLIENT_ID,
    refresh_token: refreshToken,
  });

  try {
    const response = await fetch(
      `${KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
        cache: "no-store",
        signal: AbortSignal.timeout(TIMEOUT_MS),
      },
    );

    if (!response.ok) {
      const detail = (await response.json().catch(() => ({}))) as {
        error?: string;
        error_description?: string;
      };
      // invalid_grant is the ordinary end of a session (signed out elsewhere,
      // idle too long, account disabled); anything else is worth a look.
      const log = detail.error === "invalid_grant" ? console.info : console.error;
      log(
        `[keycloak] refresh refused: ${response.status} ${detail.error ?? ""} ${detail.error_description ?? ""}`.trim(),
      );
      return null;
    }

    const json = (await response.json()) as {
      access_token?: string;
      refresh_token?: string;
      id_token?: string;
      expires_in?: number;
    };
    if (!json.access_token || typeof json.expires_in !== "number") {
      console.error("[keycloak] refresh answered a shape the laundry cannot read");
      return null;
    }
    return {
      accessToken: json.access_token,
      // Keycloak returns a new refresh token only when rotation is on; keep
      // the current one otherwise.
      refreshToken: json.refresh_token ?? refreshToken,
      idToken: json.id_token,
      expiresAt: Math.floor(Date.now() / 1000) + json.expires_in,
    };
  } catch (error) {
    console.error(
      "[keycloak] token endpoint did not answer:",
      (error as Error)?.name ?? error,
    );
    return null;
  }
}
