# SOA authentication migration

Status: **complete — all six phases landed.** Sign-in runs through SOA, access is decided
by `LAUNDRY_*` permissions, and the laundry has no way to create or edit a user. What is
left is verification against the real SOA — see "Blocked on SOA" below.
Last updated 12 August 2026.

The laundry system is becoming a sub-system of SOA. Local authentication is removed
entirely and replaced with SOA-delegated sign-in. This document is the plan of record —
read it before starting any phase.

The SOA-facing contract (what the SOA team must build) is published separately:
https://claude.ai/code/artifact/66d9eaf3-832d-43f0-b4ab-acd97f8f5a55

---

## The flow

1. An unauthenticated request to a `/staff` page redirects to SOA sign-in, carrying a
   return URL that points back at the laundry's `/authenticate` page with the originally
   requested path folded inside it.
2. SOA authenticates (or passes straight through if a session exists), checks
   `LAUNDRY_REQUEST_VIEW`, and redirects back to
   `/authenticate?redirect=<path>&token=<jwt>&expiresAt=<unix ms>`.
3. `/authenticate` calls `GET {SOA_API_URL}/api/auth/me` with that bearer token,
   builds a NextAuth session from the response, discards the token, and sends the user
   to the original path.

Public guest pages (`/`, `/track`, `/confirmation`, `/api/requests`, `/api/items`) are
untouched — they are already outside the proxy matcher.

---

## Decisions and why

**Authorization is permission-based, not role-based.** The `Role` enum
(`ADMIN | SUPERVISOR | HOUSEKEEPER`) is removed. Access is decided by `LAUNDRY_*`
permission strings carried in the session cookie, which SOA attaches to its roles.
SOA role names are stored on the user row for display only and never drive access.

**The permissions are SOA's, confirmed 12 August 2026.** Copy them verbatim — the naming
is inconsistent (`LAUNDRY_REQUEST_VIEW` singular, `LAUNDRY_REQUESTS_SEARCH` plural,
`QR_CODE_GENERATION` with no prefix) and "tidying" one silently fails closed, which is
safe but miserable to debug.

| Permission | Laundry surface |
|---|---|
| `LAUNDRY_REQUEST_VIEW` | Dashboard, own assigned tasks, request detail, notes |
| `LAUNDRY_REQUESTS_VIEW_ALL` | Whole queue instead of own tasks; SLA alert history; new-request notifications |
| `LAUNDRY_REQUEST_PROCESS` | Status transitions |
| `LAUNDRY_REQUEST_HOUSEKEEPER_ASSIGN` | Assign and reassign |
| `LAUNDRY_REQUESTS_SEARCH` | `/staff/search` |
| `LAUNDRY_REQUESTS_INVOICES_VIEW` | `/staff/invoices`, `/staff/requests/[id]/invoice` |
| `LAUNDRY_REQUESTS_INVOICES_PRINT` | `PrintButton` / `DownloadPdfButton` on those pages |
| `LAUNDRY_REQUEST_ITEMS_CATALOGUE_VIEW` | `/staff/items` read |
| `LAUNDRY_REQUEST_ITEMS_CATALOGUE_MANAGE` | Create, edit, deactivate items |
| `LAUNDRY_HOUSEKEEPERS_VIEW` | Staff roster, shift panel, assignee filter |
| `LAUNDRY_HOUSEKEEPERS_SHIFTS_MANAGE` | Availability toggle, and the `isHousekeeper` flag |
| `LAUNDRY_REPORTS_VIEW` | `/staff/reports` |
| `LAUNDRY_REPORTS_EXPORT` | *planned* — PDF export button on the reports page |
| `LAUNDRY_REQUEST_EDIT` | Staff correcting a request flagged for changes; clearing the flag |
| `QR_CODE_GENERATION` | `/staff/qrcode` — printable room QR codes |

**One permission is still ahead of the feature it gates.** Originally three, recorded on
12 August 2026 as deliberate rather than mistakes; two have since been wired up. Keep
`LAUNDRY_REPORTS_EXPORT` defined so the set matches SOA exactly, leave it unused, and wire
it when the feature lands.

- **`LAUNDRY_REPORTS_EXPORT`** is cheap when wanted: `lib/hooks/usePdfDownload.ts` and
  `components/ui/DownloadPdfButton.tsx` already exist and are used on the invoice pages, so
  it is largely wiring an existing control to `/staff/reports`.
- **`LAUNDRY_REQUEST_EDIT`** is *not* the existing edit route.
  `/api/requests/[id]/edit` is the guest editing their own request from the public tracking
  page, limited to `PENDING`. The staff route is `/api/staff/requests/[id]/edit` — a
  separate service and route. Never gate the public one with this permission.
- **`QR_CODE_GENERATION`** has no prefix because it is shared with other SOA sub-systems.
  Match the string exactly regardless.

### Design note for `LAUNDRY_REQUEST_EDIT` — resolved

Editing a request after the guest has committed collides with two existing invariants.
Both were decided on 12 August 2026, and "edit regardless of status" was **not** what was
built:

1. `RequestItem.unitPrice` is a frozen snapshot. Rather than re-pricing, a staff
   correction *carries* the price of every line already on the request and prices only new
   lines from today's catalogue — see `carriedPrices` in
   `services/requestPricing.service.ts`. So a catalogue change can never silently move the
   price of a line nobody touched.
2. Room invoices aggregate requests, and a delivered request's amount is already on the
   guest's room bill. So `DELIVERED` and `CANCELLED` are locked: they cannot be flagged and
   cannot be corrected, and an open flag blocks the `READY → DELIVERED` transition
   (`services/requestStatus.service.ts`).

Editing is therefore gated on a request having been explicitly *flagged for changes*
(`Request.needsChanges`), not merely on holding the permission. Every edit — guest or
staff — writes a `RequestRevision` holding the pre-edit state, which is what makes the
change history in `services/requestHistory.service.ts` possible.

**`LAUNDRY_REQUEST_VIEW` is the baseline.** SOA has no general "may use the laundry"
permission, so this one doubles as it — someone who cannot view a request has no business
on the dashboard. It is what the proxy checks, and what phase 5 refuses to mint a session
without.

**Marking someone a housekeeper is gated by `LAUNDRY_HOUSEKEEPERS_SHIFTS_MANAGE`.** SOA
has no separate permission for it and it sits next to shift management on the same screen;
asking for a fifteenth string to guard one boolean is not worth the round trip.

**The permission layer lands before the schema change.** Removing the enum needs
permission checks in place; permission checks need permissions in the session; the
session needs the new schema; the new schema removes the enum. The cycle is broken by
introducing the permission abstraction in phase 3 backed by a temporary
`PERMISSIONS_BY_ROLE` adapter over the existing enum, then swapping only the source in
phase 5. No call site is edited twice.

**The session expires with the SOA token.** SOA sends `expiresAt` alongside the token
and the laundry ends its session at that moment rather than guessing a duration, so the
two systems can never disagree about whether someone is signed in. An expiry in the past
is ignored and anything beyond one hour is capped — a corrupted parameter must shorten a
session, never extend one. `session.maxAge` stays at 3600 as the outer bound on the
cookie.

**`expiresAt` arrives in milliseconds, not the seconds this document originally specified**
— observed 12 August 2026 against the real SOA. `sessionExpiry()` accepts either: a
seconds timestamp does not reach 1e11 until the year 5138, so a larger value is
unambiguously milliseconds. This is worth keeping even if SOA switches to seconds, because
the failure it prevents is invisible — milliseconds read as seconds is a far-future expiry,
which the cap silently rounds down to a flat hour, and the exact-expiry guarantee is lost
with nothing in the logs to say so.

It is carried as `token.expiresAt`, **not** `token.exp`. Auth.js re-signs the session
cookie on every read and sets the JWT's own `exp` claim from `session.maxAge` each time,
so an `exp` written in the jwt callback is overwritten before it is ever read back — the
session would roll forward for as long as someone kept clicking. The jwt callback reads
`token.expiresAt` instead and returns `null` once it has passed, which is what drops the
cookie. Do not "simplify" this back to `exp`.

**SOA gates `LAUNDRY_REQUEST_VIEW` before redirecting back,** so the laundry has no
access-denied screen. It still refuses to mint a session for a profile without the
permission — the laundry must not delegate its own access control to an external system.

**Users are created only by SOA** calling the laundry's provisioning endpoint. The
laundry keeps a thin mirror so it can show who collected a bag or wrote a note without
an external call per name on screen. Names only — no department id, no role ids.

**Auto-assignment is removed.** Requests are created unassigned; a supervisor assigns
them. The 45-minute `pickup_overdue` SLA alert in `lib/utils/sla.ts` is now the only
backstop for untouched work.

**Shift availability stays** as supervisor information, and `isHousekeeper` is a
laundry-owned boolean that decides who appears in the assign dropdown.

**Two fields kept deliberately:** `staffId` (human-readable staff number, useful on
screen and free to keep) and `name` as a stored column filled from
`firstName + secondName` — dropping it for a derived helper would churn ~15 files of
selects and components for no gain.

**The database is pre-launch.** No production data to preserve, so phase 4 resets the
users table and reseeds rather than doing a nullable-then-tighten migration.

---

## Phases

Each phase is one session and one commit. Phases 1–3 each leave the app fully working
and can merge to `main` independently. **Phases 4 and 5 are one deployable unit** —
sign-in is broken between them, so they share a branch.

| # | Phase | Branch | App working after? | Landed |
|---|---|---|---|---|
| 1 | Remove auto-assignment | `feat/remove-auto-assign` | yes | ✅ |
| 2 | Remove password recovery and demo mode | `feat/remove-password-mgmt` | yes | ✅ |
| 3 | Permission layer, backed by roles | `feat/permission-layer` | yes | ✅ |
| 4 | New user schema and provisioning API | `feat/soa-auth` | **no** | ✅ |
| 5 | SOA sign-in | `feat/soa-auth` | yes | ✅ |
| 6 | Read-only user management and cleanup | `feat/soa-cleanup` | yes | ✅ |

The full prompt for each phase lives in `docs/soa-migration-phases.md`.

---

## Environment variables

Added: `SOA_API_URL`, `SOA_SIGNIN_URL`, `SOA_REDIRECT_PARAM`, `SOA_PROVISION_API_KEY`,
`SOA_PROFILE_URL`, `APP_URL`.

Removed: `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `DEMO_MODE`, `NEXT_PUBLIC_DEMO_MODE`.

No SOA URL or parameter name may be hardcoded — the exact sign-in URL is still
unconfirmed and must remain a config change.

---

## Blocked on SOA

Phase 5 is built but cannot be verified end to end until SOA ships:

1. ~~The `LAUNDRY_*` permissions~~ — **done.** Confirmed 12 August 2026, listed above.
2. Sign-in accepting a return URL and appending `token` and `expiresAt`, with a
   `LAUNDRY_REQUEST_VIEW` check before redirecting back.
3. `GET /api/auth/me` answering with the provisioning shape plus `roles[].permissions`.
4. The provisioning call on user create, update and deactivate.

`SOA_SIGNIN_URL`, `SOA_REDIRECT_PARAM` and `SOA_API_URL` are placeholders in `.env.local`
until then. Nothing reads a SOA URL from code, so pointing them at the real service is a
config change and no more. Everything else can be tested against a stub `/me`.

**Still open:** whether `/api/auth/me` has a request cap that a shift handover
(~15 sign-ins in a couple of minutes) would trip.
