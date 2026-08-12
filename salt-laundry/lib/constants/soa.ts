// SOA's URLs and its parameter names are configuration, never literals — the
// sign-in URL is still unconfirmed, so moving it must stay a config change.
// Empty means "not configured": the proxy refuses to redirect rather than
// sending someone to a half-built URL.
export const SOA_API_URL = process.env.SOA_API_URL ?? ''
export const SOA_SIGNIN_URL = process.env.SOA_SIGNIN_URL ?? ''
export const SOA_REDIRECT_PARAM = process.env.SOA_REDIRECT_PARAM ?? ''
export const APP_URL = process.env.APP_URL ?? ''

// Where someone goes to change their own details, since the laundry no longer
// edits them. Empty hides the link rather than offering a dead one.
export const SOA_PROFILE_URL = process.env.SOA_PROFILE_URL ?? ''

// The profile call. Path lives with the base URL it is appended to.
export const SOA_ME_PATH = '/api/auth/me'

// The Auth.js provider id, shared by the config and the page that calls it.
export const SOA_PROVIDER_ID = 'soa'

// Ours, not SOA's — the landing page SOA returns to and the parameters it
// hands back on it. Named here so the page, the proxy and the hook agree.
export const AUTHENTICATE_PATH = '/authenticate'
export const REDIRECT_PARAM = 'callbackUrl'
export const TOKEN_PARAM = 'token'
export const EXPIRES_AT_PARAM = 'expiresAt'

// Where a session with no requested path lands, and the outer bound on the
// cookie. A SOA token shorter than an hour shortens the session further.
export const SIGNED_IN_HOME = '/staff'
export const SESSION_MAX_AGE_SECONDS = 3600
