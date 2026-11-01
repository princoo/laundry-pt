// Reads the payload of a JWT without verifying it. Only for tokens that
// arrived straight from Keycloak's token endpoint over the back channel-
// Auth.js has already verified the ID token of the same response, and the
// access token's claims are read for roles, not trusted as authentication.
// Never use this on a token a browser handed in.
export function decodeJwtPayload<T = Record<string, unknown>>(
  token: string,
): T | null {
  const payload = token.split(".")[1];
  if (!payload) return null;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}
