# syntax=docker/dockerfile:1.7
#
# SALT Laundry, production image. One image serves every organization: the
# brand, the address, the Keycloak client and the database all come from the
# environment at run time (README, "Environment variables"), never from the
# build.
#
# Stages: deps (pnpm install), builder (prisma generate + next build, output
# "standalone"), migrate (the Prisma CLI on its own, for `migrate deploy` at
# start-up), runner (Alpine + Node, non-root, only the traced files).

ARG NODE_VERSION=22

# The application build has no native code (the Prisma client is WebAssembly,
# pg is JavaScript, sharp is excluded), so it runs once on the machine doing
# the build and the same output serves every target platform. Only the two
# stages that hold a native binary (the Prisma schema engine, the node binary)
# run per target platform.
FROM --platform=$BUILDPLATFORM node:${NODE_VERSION}-alpine AS build-base
ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    NEXT_TELEMETRY_DISABLED=1 \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable
WORKDIR /app

# Target-platform node, for the migration tooling and the runtime.
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app

# ---- dependencies -----------------------------------------------------------
FROM build-base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml prisma.config.ts ./
COPY prisma ./prisma
# postinstall runs `prisma generate`, which needs the schema but no database.
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile

# ---- build ------------------------------------------------------------------
FROM build-base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN pnpm build

# ---- migrations tooling -----------------------------------------------------
# The Prisma CLI is only needed to apply prisma/migrations at start-up. It lives
# in its own folder so the application's traced node_modules stay minimal and
# the config file can resolve `prisma/config` and `dotenv` next to itself.
#
# The CLI's package pulls in Prisma Studio, the local development database
# (`prisma dev`, an embedded Postgres) and two extra drivers: 200 MB that
# `migrate deploy` never touches. npm "overrides" swap them for an empty
# package. The version is the one the lockfile resolved for the application,
# so the schema engine matches the generated client.
FROM base AS migrate
WORKDIR /migrate
COPY --from=deps /app/node_modules/prisma/package.json ./prisma-version.json
COPY --from=deps /app/node_modules/dotenv/package.json ./dotenv-version.json
RUN node -e 'const v=p=>require(p).version;require("fs").writeFileSync("package.json",JSON.stringify({name:"laundry-migrate",private:true,dependencies:{prisma:v("./prisma-version.json"),dotenv:v("./dotenv-version.json")},overrides:{"@prisma/dev":"npm:empty-npm-package@1.0.0","@prisma/studio-core":"npm:empty-npm-package@1.0.0",mysql2:"npm:empty-npm-package@1.0.0",postgres:"npm:empty-npm-package@1.0.0"}},null,2))' \
 && rm prisma-version.json dotenv-version.json \
 && npm install --omit=dev --no-audit --no-fund \
 && rm -rf node_modules/.package-lock.json package-lock.json
# The overrides keep the heavy subtrees out of the install; the CLI bundle
# still requires their entry points (and subpaths) at start-up, so each one
# becomes a no-op module that answers any import path.
COPY docker/prisma-cli-stub.js ./stub.js
RUN for p in @prisma/dev @prisma/studio-core mysql2 postgres; do \
      rm -rf "node_modules/$p" && mkdir -p "node_modules/$p" \
      && printf '{"name":"%s","version":"0.0.0-stub","main":"index.js","exports":{".":"./index.js","./*":"./index.js"}}' "$p" > "node_modules/$p/package.json" \
      && cp stub.js "node_modules/$p/index.js"; \
    done && rm stub.js
# What is left of the CLI's own package that `migrate deploy` does not use:
# the query compilers for every database (the application ships its own in the
# generated client), Studio, and the effect library's sources, typings and ESM
# copy (the CLI bundle is CommonJS). fast-check is effect's property-testing
# helper, loaded by its barrel file, so it gets the same no-op stub.
RUN rm -rf node_modules/prisma/build/query_compiler_* node_modules/prisma/build/studio.* \
           node_modules/prisma/build/xdg-open node_modules/prisma/preinstall \
           node_modules/effect/src node_modules/effect/dist/dts node_modules/effect/dist/esm \
 && rm -rf node_modules/fast-check && mkdir -p node_modules/fast-check \
 && printf '{"name":"fast-check","version":"0.0.0-stub","main":"index.js","exports":{".":"./index.js","./*":"./index.js"}}' > node_modules/fast-check/package.json \
 && cp node_modules/mysql2/index.js node_modules/fast-check/index.js \
 && find node_modules \( -name '*.d.ts' -o -name '*.d.mts' -o -name '*.map' -o -name '*.md' \) -type f -delete \
 && rm -rf node_modules/.bin
COPY prisma.config.ts ./
COPY prisma ./prisma
# Self-check: with an unreachable database the pruned CLI must still load the
# config file and start the schema engine, failing only at the connection
# (P1001). Anything else means the pruning removed something it needed.
RUN DATABASE_URL=postgresql://check:check@127.0.0.1:1/check \
    node node_modules/prisma/build/index.js migrate deploy > /tmp/check.log 2>&1 || true; \
    grep -q "P1001" /tmp/check.log || { cat /tmp/check.log; exit 1; }; rm /tmp/check.log

# ---- runtime ----------------------------------------------------------------
# Plain Alpine (the release node:22-alpine is built on) plus the node binary
# and the two libraries it links against: no npm, corepack or yarn, which the
# server never calls. openssl is for the Prisma schema engine (migrations).
FROM alpine:3.24 AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
COPY --from=base /usr/local/bin/node /usr/local/bin/node
RUN apk add --no-cache libstdc++ libgcc openssl \
 && addgroup -S -g 1001 nodejs \
 && adduser -S -u 1001 -G nodejs nextjs
WORKDIR /app

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=migrate --chown=nextjs:nodejs /migrate ./migrate
COPY --chown=nextjs:nodejs docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health >/dev/null || exit 1

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "server.js"]
