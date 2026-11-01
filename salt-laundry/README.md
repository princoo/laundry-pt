# SALT of Akagera- Laundry Request System

A hotel laundry request system replacing a paper form workflow at SALT of Akagera, Rwanda.
Guests submit laundry requests from their room; laundry staff receive and manage them on a
live dashboard. No payment processing- costs are tracked and added to the room bill at
checkout.

Built with Next.js 16 (App Router), React 19, TypeScript, Prisma 7 on PostgreSQL, Tailwind,
and Auth.js v5 against the shared Netiiv Keycloak.

`docs/keycloak-migration.md` is the plan of record for authentication and the Keycloak client;
`docs/soa-migration.md` records the SOA token handoff it replaced.

## What it does

**Guests** (public, no login) fill in a room number, pick items from a catalogue with a service
per item (Normal, Dry-cleaning, Pressing), optionally mark the order Express or ask for hanging
delivery, see the price (items, express uplift, 15% VAT) and an estimated return time, then
track or edit the request while it is still `PENDING`.

**Staff** sign in with their Netiiv Account at `/staff`. What each person sees is decided by
the `LAUNDRY_*` permissions their account carries (below): housekeepers see their own tasks and
move requests through `PENDING → COLLECTED → IN_PROGRESS → READY → DELIVERED`; supervisors
see the whole queue, assign work, correct flagged requests, manage shifts and read reports;
the front desk searches requests and prints room invoices. Real-time notifications (SSE), SLA
alerts, PDF invoices and revenue reports round it out.

## Getting started

```bash
pnpm install
pnpm prisma migrate deploy   # create or update the schema
pnpm prisma db seed          # the item catalogue (no accounts: those are Netiiv Accounts)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) for the guest form; the staff dashboard is
at `/staff` and needs the local Keycloak:

```bash
cd ../../../netiiv/admin/keycloak && docker compose up -d
```

That stack (Keycloak 26 on `:8180`, realm `netiiv`, Mailpit on `:8025`) imports the
`soa.laundry` client on first start. A local test account with every laundry permission is
described in `docs/keycloak/local-test-user.json`; create it with the admin console or the
Admin REST API, then sign in with it.

## Sign-in

The laundry has no login page and stores no passwords. Staff authenticate against the Netiiv
Account (Keycloak, realm `netiiv`, client `soa.laundry`) and the laundry mirrors what the token
says about them.

1. An unauthenticated request to any `/staff` page is caught by `proxy.ts` and sent to
   `/authenticate`, which starts the OpenID Connect authorization-code flow (PKCE, public client)
   through Auth.js and lands on Keycloak's login page.
2. Keycloak comes back to `/api/auth/callback/keycloak`. The access token's
   `resource_access["soa.laundry"].roles` become the session's `permissions` (the strings in
   `lib/constants/permissions.ts`) and `roleNames` (the business roles: Super Admin,
   Housekeeping Chief, Front Officer, ...). The person's mirror row (`users`) is created or
   updated from the token claims (`services/keycloakUser.service.ts`).
3. The access token lives 5 minutes, but the laundry trusts its cookie for only
   `SESSION_REVALIDATE_SECONDS` (10 by default) before refreshing it with Keycloak and re-reading
   the roles, so a role a reviewer assigns or removes lands on the next request after that
   window, without a sign-out. When Keycloak refuses the refresh (session deleted in the admin
   console, signed out elsewhere, idle too long, account disabled) the session ends.
4. An account with no `soa.laundry` role yet sees "No access yet" on `/staff`, with a button that
   refreshes the token after a reviewer has assigned one.
5. Sign out ends the Keycloak session too, for every Netiiv application, and returns to the
   guest form.

Accounts are created by self-registration on Keycloak's login page. A reviewer (`USER_ADMIN`,
which every Super Admin holds) assigns roles in the realm's admin console, reached from
`/staff/profile` next to the account console. No screen in the laundry creates or edits a user;
the only laundry-owned fields are the housekeeper and on-shift flags on `/staff/users`.

### Permissions

| Permission | Laundry surface |
| --- | --- |
| `LAUNDRY_REQUEST_VIEW` | Dashboard, own assigned tasks, request detail, notes. The baseline for `/staff` |
| `LAUNDRY_REQUESTS_VIEW_ALL` | Whole queue instead of own tasks; SLA alert history; new-request notifications |
| `LAUNDRY_REQUEST_PROCESS` | Status transitions; flagging a request for changes |
| `LAUNDRY_REQUEST_EDIT` | Correcting a flagged request; clearing the flag |
| `LAUNDRY_REQUEST_HOUSEKEEPER_ASSIGN` | Assign and reassign |
| `LAUNDRY_REQUESTS_SEARCH` | `/staff/search` |
| `LAUNDRY_REQUESTS_INVOICES_VIEW` | `/staff/invoices`, `/staff/requests/[id]/invoice` |
| `LAUNDRY_REQUESTS_INVOICES_PRINT` | Print and PDF download on those pages |
| `LAUNDRY_REQUEST_ITEMS_CATALOGUE_VIEW` | `/staff/items` read |
| `LAUNDRY_REQUEST_ITEMS_CATALOGUE_MANAGE` | Create, edit, reorder, deactivate items |
| `LAUNDRY_HOUSEKEEPERS_VIEW` | Staff roster, shift panel, assignee filter |
| `LAUNDRY_HOUSEKEEPERS_SHIFTS_MANAGE` | Availability toggle and the housekeeper flag |
| `LAUNDRY_REPORTS_VIEW` | `/staff/reports` |
| `LAUNDRY_REPORTS_EXPORT` | Planned: PDF export on the reports page |
| `QR_CODE_GENERATION` | `/staff/qrcode`, printable room QR codes |
| `USER_ADMIN` | The admin console link on `/staff/profile` |

The same names are the permission roles of the `soa.laundry` client; the business roles are
composites of them (`docs/keycloak-migration.md`, section 5).

## Environment variables

Copy these into `.env` (or `.env.local`).

| Variable | What it is |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` (or `AUTH_SECRET`) | Secret Auth.js signs the session cookie with |
| `NEXTAUTH_URL` | This app's own origin, for Auth.js |
| `APP_URL` | This app's public origin: post-logout and account-console return addresses are built from it and must match the client's redirect URIs |
| `KEYCLOAK_URL` | Base address of Keycloak: `http://localhost:8180` locally, `https://account.netiiv.com` in production |
| `KEYCLOAK_REALM` | `netiiv` (default) |
| `KEYCLOAK_CLIENT_ID` | `soa.laundry` (default) |
| `SESSION_REVALIDATE_SECONDS` | How long a session is trusted before Keycloak is asked again (default 10). A session deleted or a role changed in Keycloak lands on the next request after that; 0 re-checks only when the access token nears expiry |

One image, one configuration per organization. Everything that names the hotel is read from the
environment at request time, never baked into the build:

| Variable | Default | What it is |
| --- | --- | --- |
| `ORG_NAME` | `SALT of Akagera` | The organization. Page titles, invoices, footers, the share image |
| `ORG_SHORT_NAME` | `SALT` | Its short form: "SALT Laundry", "SALT Staff" |
| `APP_NAME` | `<short name> Laundry` | The product name as the organization calls it |
| `ORG_ADDRESS` | `Akagera National Park, Rwanda` | On invoices and the share image |
| `GUEST_HELP_LINE` | `Need help? Dial 0 for the front desk.` | The guest footer's help line |
| `BRAND_LOGO_URL` | `/salt-logo.png` | Logo in the nav bars, status pages and printed room cards: a path under `public/` or an absolute URL |
| `BRAND_QR_LOGO_URL` | `/qrcode-logo.png` | Square logo in the centre of every room QR code |
| `APP_LOCALE` | `en_RW` | Open Graph locale |
| `SKIP_MIGRATIONS` | `0` | `1` skips `prisma migrate deploy` at container start |

A second hotel is therefore a second deployment of the same image with its own database, its own
Keycloak client (`<organization>.laundry`, created from `docs/keycloak/` as `soa.laundry` was) and
these variables, for example `ORG_NAME="Kimironko Guest House"`, `ORG_SHORT_NAME=KGH`,
`KEYCLOAK_CLIENT_ID=kgh.laundry`, `APP_URL=https://kgh.laundry.netiiv.com`. The hotel timezone
(`lib/constants/timezone.ts`, `Africa/Kigali`) and the currency and VAT rate
(`lib/constants/pricing.ts`, `lib/utils/formatting.ts`) are still constants.

## Deploying with Docker

The image is built once and configured per deployment:

```bash
docker buildx build --platform linux/amd64,linux/arm64 -t aimelive/laundry-service:latest --push .
```

```bash
docker run --rm -p 3000:3000 --env-file .env.production aimelive/laundry-service:latest
```

- Multi-stage `Dockerfile`: pnpm install, `next build` with `output: "standalone"`, the Prisma CLI
  in its own folder, and an Alpine runtime that runs as `nextjs` (uid 1001) with only the traced
  files. No image optimizer and no `sharp`: the logos are plain `<img>`.
- At start the entrypoint runs `prisma migrate deploy` against `DATABASE_URL`, then starts the
  server on `PORT` (3000). It retries the migration step (`MIGRATE_ATTEMPTS`, default 5, every
  `MIGRATE_RETRY_SECONDS`, default 5) because a serverless database such as Neon takes a few
  seconds to wake from idle and Prisma reports that as P1002. Set `SKIP_MIGRATIONS=1` to run
  migrations elsewhere.
- Size: about 226 MB unpacked, 73 MB to download, for both `linux/amd64` and `linux/arm64`. Of
  that, the Node binary is 120 MB, the application 40 MB and the migration tooling 46 MB.
- `GET /api/health` answers `200 {"status":"ok"}` when the database is reachable and `503`
  otherwise; the image's `HEALTHCHECK` and Coolify's health check both use it.
- Keycloak side of a deployment: either the partial import of `docs/keycloak/*.json` on the
  `netiiv` realm or `scripts/laundry-client.py` in the Keycloak repository (for another hotel:
  `KC_ORG=kgh`), then `delegated-user-admin.py` for the reviewers' console.
- Coolify: a Docker-image resource pointing at `aimelive/laundry-service:latest`, the variables
  above plus `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `APP_URL`, `KEYCLOAK_URL`,
  `KEYCLOAK_CLIENT_ID`, port 3000, health check path `/api/health`.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Development server |
| `pnpm build` | `prisma generate` then a production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint |
| `pnpm prisma db seed` | Reseed the catalogue |

## Project structure

```
salt-laundry/
├── app/                    # App Router: routes, layouts, API handlers
│   ├── (guest)/ track/ confirmation/   # public guest pages
│   ├── authenticate/       # starts the Keycloak sign-in
│   ├── staff/              # authenticated dashboard
│   └── api/                # route handlers (requests, items, staff, admin, supervisor, auth)
├── components/             # guest/ staff/ admin/ track/ ui/
├── lib/
│   ├── auth.ts             # Auth.js: Keycloak provider, token refresh, session shape
│   ├── actions/auth.ts     # server actions: start sign-in, sign out everywhere
│   ├── keycloakClient.ts   # refresh-token call
│   ├── constants/          # permissions, roles (display), auth, navigation, ...
│   ├── hooks/ types/ utils/ validations/
├── services/               # all Prisma access; keycloakUser.service.ts is the mirror
├── prisma/                 # schema, migrations, catalogue seed
├── proxy.ts                # session gate for /staff and the staff APIs
├── Dockerfile              # production image (see "Deploying with Docker")
├── docker-entrypoint.sh    # migrate deploy, then node server.js
├── docker/                 # build-time helpers for the image
└── docs/                   # keycloak-migration.md, keycloak/ (client import files)
```

Route handlers stay thin: `requirePermission()` from `lib/utils/guards.ts`, a Zod schema, then a
function in `services/`. Hiding a control is not access control- every page gate has a matching
API gate.
