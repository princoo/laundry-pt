# SALT of Akagera — Laundry Request System

A hotel laundry request system replacing a paper form workflow at SALT of Akagera, Rwanda.
Guests submit laundry requests from their room; laundry staff receive and manage them on a
live dashboard. No payment processing — costs are tracked and added to the room bill at
checkout.

Built with Next.js 16 (App Router), TypeScript, Prisma on PostgreSQL, Tailwind, and
Auth.js v5.

`CLAUDE.md` is the working reference for architecture and conventions.
`docs/soa-migration.md` records how authentication got to be the way it is.

## Getting started

```bash
pnpm install
pnpm prisma migrate dev     # create the schema
pnpm prisma db seed         # catalogue items and SOA-shaped staff accounts
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) for the guest form. The staff
dashboard is at `/staff` and requires a SOA session — see below.

## Sign-in

The laundry has no login page and stores no passwords. Staff authenticate against SOA
(the hotel's staff platform) and the laundry mirrors their account.

1. An unauthenticated request to any `/staff` page is caught by `proxy.ts` and redirected
   to `SOA_SIGNIN_URL`, carrying a return URL that points back at the laundry's
   `/authenticate` page with the originally requested path folded inside it.
2. SOA signs the person in, checks they hold `LAUNDRY_REQUEST_VIEW`, and redirects to
   `/authenticate?redirect=<path>&token=<jwt>&expiresAt=<unix ms>`.
3. `/authenticate` calls `GET {SOA_API_URL}/api/auth/me` with that bearer token, upserts
   the laundry's copy of the user, builds the session, discards the token, and replaces
   the URL with the original path.

The session expires at exactly the moment SOA's token does, capped at one hour. What each
person can see and do is decided by the `LAUNDRY_*` permissions SOA returns — the laundry
has no roles of its own.

Accounts are created, updated and deactivated only by SOA, calling
`POST /api/integrations/soa/users` and `PATCH /api/integrations/soa/users/[soaId]` with an
`X-SOA-Api-Key` header. No screen in the laundry creates or edits a user.

Guest pages (`/`, `/track`, `/confirmation`) and their APIs are fully public.

## Environment variables

Copy these into `.env.local`.

| Variable | What it is |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Secret Auth.js signs the session cookie with |
| `NEXTAUTH_URL` | This app's own origin, for Auth.js |
| `APP_URL` | This app's public origin, used to build the return URL sent to SOA |
| `SOA_API_URL` | Base URL of the SOA API — `/api/auth/me` is appended to it |
| `SOA_SIGNIN_URL` | SOA's sign-in page, where an unauthenticated visitor is sent |
| `SOA_REDIRECT_PARAM` | Name of the query parameter SOA reads the return URL from |
| `SOA_PROFILE_URL` | Where staff manage their own details; linked from `/staff/profile`. Leave empty to hide the link |
| `SOA_PROVISION_API_KEY` | Shared key the provisioning endpoints check `X-SOA-Api-Key` against |

No SOA URL or parameter name is hardcoded anywhere, so pointing the app at the real SOA
instance is a config change and nothing more.

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Development server |
| `pnpm build` | `prisma generate` then a production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint |
| `pnpm prisma db seed` | Reseed the catalogue and staff accounts |
