# SOA migration — phase prompts

Read `docs/soa-migration.md` first for the decisions behind these. Each phase is one
session. Start a fresh session with:

> Read salt-laundry/docs/soa-migration.md and salt-laundry/CLAUDE.md, then carry out
> Phase N from docs/soa-migration-phases.md.

Tick a phase off in the table in `soa-migration.md` when it lands.

---

## Phase 1 — Remove auto-assignment

Requests are now created unassigned and a supervisor assigns them manually.

- `services/assignment.service.ts` — delete `autoAssign()`. Rename `manualReassign()` to
  `assignRequest()`; it is now the only way a request gets an assignee, not just a way to
  move one.
- `app/api/requests/route.ts` — remove the `autoAssign()` call after request creation.
- Move `ACTIVE_STATUSES` out of `assignment.service.ts` into `lib/constants/statuses.ts`
  and update its importers (`availability.service.ts`, `staffOverview.service.ts`).
- `prisma/schema.prisma` — drop `Request.assignmentMethod` and the `AssignmentMethod`
  enum. Add a migration.
- `services/notification.service.ts` — `KIND_BY_METHOD` keyed off `assignmentMethod` no
  longer makes sense with only manual assignment. Simplify to a single assignment kind.
- Search components for wording that assumes auto-assignment (`AssignmentCard`,
  `RequestCard`, `NotificationItem`, `HousekeeperDashboard`) and update the copy per
  CLAUDE.md's UI writing rules.

Do not touch authentication, the `Role` enum, or the users table.

**Done when:** a new guest request is created with `assignedToId` null and status
`PENDING`, appears in the supervisor queue, and a supervisor can assign it. No reference
to `autoAssign` or `assignmentMethod` remains.

---

## Phase 2 — Remove password recovery and demo mode

Email/password sign-in itself must keep working — it is removed in phase 5.

**Delete:**

- `app/api/auth/forgot-password/`, `app/api/auth/reset-password/`,
  `app/api/admin/users/[id]/reset-password/`
- `app/staff/forgot-password/`, `app/staff/reset-password/`, `app/staff/change-password/`
- `components/staff/`: `ForgotPasswordForm`, `ForgotPasswordScreen`, `ForgotPasswordSent`,
  `ResetPasswordForm`, `ResetPasswordScreen`, `ResetPasswordDone`, `ChangePasswordForm`,
  `CurrentPasswordField`, `NewPasswordFields`, `ProfilePasswordCard`, `StaffDemoLogin`
- `components/ui/PasswordChecklist.tsx`, `components/admin/ResetPasswordModal.tsx`
- `services/passwordReset.service.ts`, `lib/email.ts`, `lib/utils/emailTemplates.ts`,
  `lib/utils/token.ts`, `lib/utils/password.ts`
- `lib/validations/passwordReset.schema.ts`, `lib/constants/demoMode.ts`,
  `lib/hooks/useDemoAutoLogin.ts`, `lib/hooks/useChangePassword.ts`
- `PASSWORD_RECOVERY_STEPS` from `lib/constants/authFlow.ts` — keep
  `STAFF_PORTAL_HIGHLIGHTS`, the login aside still uses it

**Edit:**

- `lib/auth.ts` — remove the `DEMO_MODE` branch and `mustChangePassword` from the
  `authorize` return and both callbacks. Keep the credentials provider and bcrypt check.
- `proxy.ts` — remove the `mustChangePassword` redirect and `CHANGE_PASSWORD_PATH`.
  `PUBLIC_STAFF_PATHS` becomes `['/staff/login']`.
- `app/staff/layout.tsx` — remove the `mustChangePassword` branch.
- `app/staff/login/page.tsx` — remove the `?email=` demo branch.
- `services/account.service.ts` — remove password handling from `updateOwnProfile` and
  `mustChangePassword` from `OWN_PROFILE_SELECT`.
- `lib/validations/profile.schema.ts` — drop the password fields.
- `lib/hooks/useProfile.ts` — drop `mustChangePassword` from `OwnProfile`.
- `app/staff/profile/page.tsx`, `components/admin/UsersPageModals.tsx`,
  `components/admin/UserActions.tsx` — remove the deleted cards and actions.
- `package.json` — remove `nodemailer` and `@types/nodemailer`.
- `.env` / `.env.local` — remove `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `DEMO_MODE`,
  `NEXT_PUBLIC_DEMO_MODE`.

Leave the users table alone — `password`, `mustChangePassword`, `passwordResetToken` and
`passwordResetExpiry` stay as unused columns and are dropped in phase 4. No migration.

**Done when:** sign-in with email and password still works, nothing references the
deleted files, and `pnpm build` passes.

---

## Phase 3 — Permission layer, still backed by roles

Replace every role comparison with a permission check. Permissions are still derived from
the `Role` enum in this phase — only the source changes in phase 5, so no call site should
need editing again.

**Create:**

- `lib/constants/permissions.ts` — the fifteen SOA permission strings as a literal tuple
  plus an inferred type. **Copy them character for character.** The naming is inconsistent
  on SOA's side (`LAUNDRY_REQUEST_VIEW` singular vs `LAUNDRY_REQUESTS_SEARCH` plural,
  and `QR_CODE_GENERATION` carries no prefix). Do not normalise them — a "corrected"
  string simply never matches, which fails closed and is very hard to spot. Add a comment
  in the file saying exactly this.

  ```
  LAUNDRY_REQUEST_VIEW
  LAUNDRY_REQUESTS_VIEW_ALL
  LAUNDRY_REQUESTS_INVOICES_VIEW
  LAUNDRY_REQUESTS_INVOICES_PRINT
  LAUNDRY_REQUESTS_SEARCH
  LAUNDRY_REQUEST_PROCESS
  LAUNDRY_REQUEST_EDIT
  LAUNDRY_REQUEST_HOUSEKEEPER_ASSIGN
  LAUNDRY_REQUEST_ITEMS_CATALOGUE_VIEW
  LAUNDRY_REQUEST_ITEMS_CATALOGUE_MANAGE
  LAUNDRY_HOUSEKEEPERS_VIEW
  LAUNDRY_HOUSEKEEPERS_SHIFTS_MANAGE
  LAUNDRY_REPORTS_VIEW
  LAUNDRY_REPORTS_EXPORT
  QR_CODE_GENERATION
  ```

  Three of these gate features that do not exist yet — `LAUNDRY_REPORTS_EXPORT`,
  `LAUNDRY_REQUEST_EDIT` and `QR_CODE_GENERATION`. All three are planned and deliberate,
  not mistakes; see `docs/soa-migration.md` for what each is for. Define them so the set
  matches SOA exactly, mark them in the file as awaiting their feature, and **do not build
  or invent surfaces for them in this phase.** In particular `LAUNDRY_REQUEST_EDIT` is not
  the existing `/api/requests/[id]/edit` route, which is the public guest flow — do not
  gate that route with it.

- `lib/utils/permissions.ts` — `hasPermission(permissions, permission)` and a
  `PERMISSIONS_BY_ROLE` map. Comment the map clearly as a temporary bridge deleted when
  SOA becomes the source in phase 5.
  - `HOUSEKEEPER`: `LAUNDRY_REQUEST_VIEW`, `LAUNDRY_REQUEST_PROCESS`
  - `SUPERVISOR`: those plus `LAUNDRY_REQUESTS_VIEW_ALL`, `LAUNDRY_REQUESTS_SEARCH`,
    `LAUNDRY_REQUEST_HOUSEKEEPER_ASSIGN`, `LAUNDRY_REQUESTS_INVOICES_VIEW`,
    `LAUNDRY_REQUESTS_INVOICES_PRINT`, `LAUNDRY_HOUSEKEEPERS_VIEW`,
    `LAUNDRY_HOUSEKEEPERS_SHIFTS_MANAGE`, `LAUNDRY_REQUEST_ITEMS_CATALOGUE_VIEW`
  - `ADMIN`: all fifteen
- `components/ui/PermissionGate.tsx` — renders children only when the session carries the
  permission.
- `lib/hooks/usePermissions.ts` — client-side access to the session's permission list.

**Edit:**

- `lib/auth.ts` — derive `token.permissions` from the user's role in the jwt callback and
  expose it on the session.
- `lib/utils/guards.ts` — replace `requireAuth`/`requireSupervisor`/`requireAdmin` with
  `requirePermission(permission)`. `getCurrentUser()` returns
  `{ id, email, name, permissions }`.
- Rewrite every role comparison to a permission check. SOA's set is finer-grained than the
  old three roles, so some surfaces that shared a gate now need separate ones — reading the
  catalogue is now distinct from editing it, and viewing an invoice is distinct from
  printing it.

  | Permission | Gate it in |
  |---|---|
  | `LAUNDRY_REQUEST_VIEW` | Baseline for `/staff`. `requirePermission` on `GET /api/staff/requests`, `/api/staff/requests/[id]`, `/api/staff/stats`, the notes routes |
  | `LAUNDRY_REQUESTS_VIEW_ALL` | `services/staffRequestQueue.service.ts`, `staffStats.service.ts`, `staffRequest.service.ts` (SLA alert history), `notificationStream.service.ts` (new-request feed), `lib/utils/requestAccess.ts`, `app/staff/page.tsx` (which dashboard) |
  | `LAUNDRY_REQUEST_PROCESS` | `PATCH /api/staff/requests/[id]`, `components/staff/RequestActions.tsx`, `StatusStepper.tsx` |
  | `LAUNDRY_REQUEST_HOUSEKEEPER_ASSIGN` | `PATCH /api/staff/requests/[id]/assign`, `ReassignModal.tsx`, the reassign affordance in `RequestCard.tsx` |
  | `LAUNDRY_REQUESTS_SEARCH` | `app/staff/search/`, `GET /api/staff/search`, the Search nav link |
  | `LAUNDRY_REQUESTS_INVOICES_VIEW` | `app/staff/invoices/`, `app/staff/requests/[id]/invoice/`, `GET /api/staff/invoices` |
  | `LAUNDRY_REQUESTS_INVOICES_PRINT` | `components/ui/PrintButton.tsx` and `DownloadPdfButton.tsx` where `InvoiceCard.tsx` and `RoomInvoiceResult.tsx` render them |
  | `LAUNDRY_REQUEST_ITEMS_CATALOGUE_VIEW` | `app/staff/items/`, `app/staff/items/[id]/`, `GET /api/admin/items` |
  | `LAUNDRY_REQUEST_ITEMS_CATALOGUE_MANAGE` | `POST`/`PATCH`/`DELETE` on `/api/admin/items`, and the create/edit controls on those pages |
  | `LAUNDRY_HOUSEKEEPERS_VIEW` | `app/staff/users/`, `/api/supervisor/staff-overview`, `/api/supervisor/housekeepers`, `AssigneeFilter.tsx`, `StaffOverviewPanel.tsx` |
  | `LAUNDRY_HOUSEKEEPERS_SHIFTS_MANAGE` | `PATCH /api/staff/users/[id]/availability`, `services/availability.service.ts`, the shift toggle |
  | `LAUNDRY_REPORTS_VIEW` | `app/staff/reports/`, `GET /api/admin/reports` |

  A page gate and its API gate must both exist — hiding a nav link is not access control.

  Note that `/api/admin/items` and `/api/admin/reports` are now misnamed, since "admin" is
  no longer a concept. Leave the paths alone in this phase; renaming them is churn that
  would collide with everything else here.
- `lib/constants/navigation.ts` — give each nav link the permission it requires instead of
  grouping by `ADMIN`.
- `components/staff/RoleBadge.tsx` and `components/admin/RoleBadge.tsx` — take a list of
  role names as strings rather than the enum, ready for SOA role names.

Keep the `Role` enum in the schema; it is the input to `PERMISSIONS_BY_ROLE`.

**Done when:** behaviour is identical for all three roles, and no comparison against
`'ADMIN'`, `'SUPERVISOR'` or `'HOUSEKEEPER'` exists outside `lib/utils/permissions.ts`.

---

## Phase 4 — New user schema and the provisioning API

> Sign-in stops working at the end of this phase. Run phase 5 immediately after, on the
> same branch.

The database is pre-launch — a clean migration and reseed is fine.

**Schema** — replace the `User` model with:

```prisma
id             String   @id @default(cuid())
soaId          String   @unique
staffId        String?
firstName      String?
secondName     String?
name           String?          // stored, from firstName + secondName, so existing selects keep working
email          String   @unique
phoneNumber    String?
departmentName String?
roleNames      String[]
isHousekeeper  Boolean  @default(false)
isActive       Boolean  @default(true)
isAvailable    Boolean  @default(true)
// createdAt / updatedAt / the three existing relations unchanged
```

Drop `password`, `role`, `mustChangePassword`, `passwordResetToken`,
`passwordResetExpiry`, and the `Role` enum. Names only — no department id, no role ids.

**Create:**

- `lib/validations/soaUser.schema.ts` — Zod schema for the provisioning payload:
  `{ id, staffId?, email, firstName?, secondName?, phoneNumber?, status: 'ACTIVE'|'INACTIVE', department?: string, roles?: string[] }`.
  Accept `department` and `roles` as either plain strings or SOA's full objects, reading
  the name out of the object form.
- `services/soaUser.service.ts` — `upsertFromSoa(payload)`, upserting on `soaId` and
  mapping `status` to `isActive`. Never delete.
- `app/api/integrations/soa/users/route.ts` (POST) and `.../[soaId]/route.ts` (PATCH).
  Both check an `X-SOA-Api-Key` header against `SOA_PROVISION_API_KEY` with a timing-safe
  comparison. 201 create, 200 update, 400 invalid payload, 401 bad key, 409 email belongs
  to a different `soaId`.
- `prisma/seed.ts` — rewrite to create SOA-shaped users with `soaId` values, no passwords.

**Edit:**

- `services/user.service.ts` — delete `createUser`, `updateUser`, `findUserByEmail` and the
  bcrypt import. `getActiveHousekeepers()` and `getActiveHousekeeperById()` filter on
  `isHousekeeper: true, isActive: true` and return `isAvailable` so the dropdown can mark
  who is off shift.
- `services/staffOverview.service.ts` — filter on `isHousekeeper: true, isActive: true`.
- `services/availability.service.ts` — remove the `ADMIN` check; guard on `isHousekeeper`.
- `lib/validations/user.schema.ts` — delete `createUserSchema` and `updateUserSchema`.
- `lib/utils/permissions.ts` — `PERMISSIONS_BY_ROLE` has no enum to read from now. Leave
  the permission set in place with a TODO; phase 5 wires it to SOA.

Add `SOA_PROVISION_API_KEY` to `.env`. Do not touch `lib/auth.ts`, `proxy.ts` or the login
page — phase 5 owns those.

**Done when:** migrate and seed run clean, and the provisioning endpoints create, update
and deactivate correctly — including a retry of the same POST being a no-op rather than a
duplicate.

---

## Phase 5 — SOA sign-in

Finishes the cutover. Next.js 16 (`proxy.ts`, not `middleware.ts`) and Auth.js v5.

**Create:**

- `app/authenticate/page.tsx` — outside `/staff`, noindex, `Referrer-Policy: no-referrer`.
  A thin shell over a client component that calls
  `signIn('soa', { token, expiresAt, redirect: false })`, then `router.replace(redirect)`
  so the token never stays in history. On failure show what went wrong and a retry button —
  this page exists specifically so a mid-flow failure is recoverable.
- `lib/utils/redirectTarget.ts` — validate the redirect param is a relative path starting
  with a single `/`. Reject `//` and absolute URLs, falling back to `/staff`. An
  unvalidated redirect turns this page into an open redirect.
- `lib/soaClient.ts` — the `/me` call. It is a `fetch`, and CLAUDE.md forbids `fetch`
  inside `services/`, so it does not belong there.

**Edit:**

- `lib/auth.ts` — replace the credentials provider with one named `soa` taking
  `{ token, expiresAt }`. `authorize()` calls `/me`, upserts the laundry user via
  `soaUser.service`, and returns `id`, `soaId`, `email`, `name`, `departmentName`,
  `roleNames` and the flattened deduped permissions from `roles[].permissions`. Return
  `null` if the profile has no `LAUNDRY_REQUEST_VIEW` — SOA has no general "may use the
  laundry" permission, so that one is the baseline. SOA gates it before redirecting, but
  the laundry must not mint a session for a profile without it.
  In the jwt callback set `token.exp` from `expiresAt` so the session expires exactly with
  the SOA token. Ignore an `expiresAt` in the past and cap it at one hour ahead — a bad
  parameter must shorten a session, never extend one. Keep `session.maxAge` at 3600 as the
  outer bound on the cookie itself.
- `lib/utils/permissions.ts` — delete `PERMISSIONS_BY_ROLE`. Permissions come from the
  session now.
- `proxy.ts` — no session on a page request redirects to
  `${SOA_SIGNIN_URL}?${SOA_REDIRECT_PARAM}=${encodeURIComponent(APP_URL + '/authenticate?redirect=' + pathname)}`.
  No session on an `/api/` request still returns 401 JSON. Remove `PUBLIC_STAFF_PATHS`.
  Add `/api/supervisor/:path*` to the matcher; exclude `/authenticate`.
- Add a shared fetch wrapper used by every hook in `lib/hooks/`: on a 401, send the browser
  through the sign-in redirect instead of rendering a generic failure. Cover the SSE stream
  in `app/api/staff/notifications/stream/route.ts` too — it must close cleanly when the
  session lapses.
- `components/staff/SignOutButton.tsx` — sign out locally, then send the user to SOA rather
  than to a laundry login page.
- `components/guest/StaffAccessLink.tsx` — the signed-out branch links to `/staff`, which
  triggers the redirect.

**Delete:** `app/staff/login/`, `components/staff/StaffLoginForm.tsx`,
`StaffLoginFields.tsx`, `StaffLoginAside.tsx`, `lib/validations/staffLogin.schema.ts`,
`lib/constants/authFlow.ts`.

Add `SOA_API_URL`, `SOA_SIGNIN_URL`, `SOA_REDIRECT_PARAM`, `APP_URL` to `.env`. No SOA URL
or parameter name may be hardcoded.

**Done when:** hitting `/staff` while signed out redirects to SOA; returning with a valid
token lands on the originally requested page with the token stripped from the URL;
permissions from `/me` drive what is visible; and an expired session bounces cleanly
rather than showing an error.

---

## Phase 6 — Read-only user management and cleanup

- `app/staff/users/` — **create and edit were already removed in phase 4**, not by choice:
  dropping `role` and `password` from the schema left `createUser`/`updateUser` and their
  schemas with nothing to write, so `UserFormModal.tsx`, `UserFormFields.tsx`,
  `UsersPageModals.tsx`, `UserActions.tsx`, `lib/validations/user.schema.ts`,
  `buildUserPayload`, `POST /api/admin/users` and `PATCH /api/admin/users/[id]` all went
  with them. What is left here is the roster's read-only columns — phone is still not
  shown, and `staffId` is fetched but unused. Gate the page on
  `LAUNDRY_HOUSEKEEPERS_VIEW`. The only writes left are the `isHousekeeper`
  and `isAvailable` toggles, both gated on `LAUNDRY_HOUSEKEEPERS_SHIFTS_MANAGE` — SOA has
  no separate permission for the housekeeper flag and it sits on the same screen as shift
  management. Add `PATCH /api/staff/users/[id]/housekeeper` alongside the existing
  availability route.
- `app/staff/profile/` — read-only view of the SOA-sourced details with a link to manage
  them in SOA. Delete `services/account.service.ts`, `app/api/staff/profile/` and
  `lib/validations/profile.schema.ts` if nothing else uses them.
- `package.json` — remove `bcryptjs` and `@types/bcryptjs`.
- **Update CLAUDE.md.** Three sections are now wrong and will mislead future work if left:
  the Auth section under General rules, the Roles section under Domain knowledge, and the
  Assignment flow section. Replace them with the SOA flow, the `LAUNDRY_*`
  permissions, and manual-only assignment. Also update the folder structure block and the
  "what goes where" table.
- Update `README.md` with the new environment variables and the SOA sign-in flow.

**Done when:** no laundry screen can create or edit a user, CLAUDE.md describes the system
as it now is, and `pnpm build` passes with no unused dependencies.
