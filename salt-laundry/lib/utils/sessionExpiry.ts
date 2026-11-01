const nowSeconds = () => Math.floor(Date.now() / 1000);

// Fails closed: anything that is not a number is treated as expired. Used for
// the access token's `exp`, which is the one clock the session keeps.
export function isExpired(expiresAt: number | null | undefined): boolean {
  return typeof expiresAt !== "number" || expiresAt <= nowSeconds();
}
