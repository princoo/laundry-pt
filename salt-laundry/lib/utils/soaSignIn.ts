import {
  APP_URL, AUTHENTICATE_PATH, REDIRECT_PARAM, SESSION_MAX_AGE_SECONDS,
  SOA_REDIRECT_PARAM, SOA_SIGNIN_URL,
} from '@/lib/constants/soa'

// SOA sign-in, carrying a return URL that points back at /authenticate with
// the originally requested path folded inside it. Null when SOA is not
// configured — the caller reports that rather than redirecting nowhere.
export function soaSignInUrl(pathname: string): string | null {
  if (!SOA_SIGNIN_URL || !SOA_REDIRECT_PARAM || !APP_URL) return null

  const returnUrl =
    `${APP_URL}${AUTHENTICATE_PATH}?${REDIRECT_PARAM}=${encodeURIComponent(pathname)}`
  const separator = SOA_SIGNIN_URL.includes('?') ? '&' : '?'
  return `${SOA_SIGNIN_URL}${separator}${SOA_REDIRECT_PARAM}=${encodeURIComponent(returnUrl)}`
}

const nowSeconds = () => Math.floor(Date.now() / 1000)

// SOA sends expiresAt in milliseconds, not the seconds its contract described.
// Accept either rather than depending on which: a seconds timestamp does not
// reach 1e11 until the year 5138, so anything above that is unambiguously
// milliseconds. Guessing wrong in this direction is not possible; reading
// milliseconds as seconds is, and it silently costs the exact expiry below.
const MILLISECONDS_FLOOR = 1e11

function toSeconds(value: number): number {
  return value > MILLISECONDS_FLOOR ? value / 1000 : value
}

// The session ends with the SOA token, so the two systems can never disagree
// about whether someone is signed in. A bad parameter must shorten a session,
// never extend one — so an unparseable or already-past value is refused
// outright (null) rather than falling back to the cap, which would hand a full
// hour to anyone who stripped `&expiresAt=` off the return URL. Anything
// further out than the cap is capped.
export function sessionExpiry(expiresAt: unknown): number | null {
  const parsed = Number(expiresAt)
  if (!Number.isFinite(parsed)) return null

  const seconds = toSeconds(parsed)
  if (seconds <= nowSeconds()) return null
  return Math.min(Math.floor(seconds), nowSeconds() + SESSION_MAX_AGE_SECONDS)
}

// Fails closed: anything that is not a number is treated as expired. This is
// the one check that ends a session, so an absent or malformed expiry must
// never read as "still valid".
export function isExpired(expiresAt: number | null | undefined): boolean {
  return typeof expiresAt !== 'number' || expiresAt <= nowSeconds()
}
