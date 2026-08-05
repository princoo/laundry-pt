// ── DEMO MODE — TESTING ONLY ─────────────────────────────────────────────
// Both flags live in .env.local and must never be set in production. With
// them absent or 'false' every demo branch in the codebase is skipped and the
// original password check runs — no code changes needed to switch back.

// Server flag. Gates the password bypass in lib/auth.ts. Reads as undefined
// in the browser, which is why the login page uses the public flag below.
export const DEMO_MODE = process.env.DEMO_MODE === 'true'

// Client flag. Gates the ?email= auto-login and the amber banner on
// /staff/login. Written out in full so Next.js can inline it at build time.
export const DEMO_MODE_CLIENT = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
