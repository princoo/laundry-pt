#!/bin/sh
# Applies pending database migrations, then starts the server. Every deploy of
# every organization runs against its own database, so the migration step is
# part of start-up rather than a separate release job. SKIP_MIGRATIONS=1 skips
# it (for a read replica, or when migrations are run elsewhere).
#
# The step retries: a serverless database (Neon suspends an idle compute) can
# take several seconds to wake, and Prisma reports that as P1002, "reached but
# timed out". Five attempts a few seconds apart cover a cold start without
# masking a database that is really down, which still ends the container.
set -eu

MIGRATE_ATTEMPTS="${MIGRATE_ATTEMPTS:-5}"
MIGRATE_RETRY_SECONDS="${MIGRATE_RETRY_SECONDS:-5}"

if [ "${SKIP_MIGRATIONS:-0}" != "1" ]; then
  attempt=1
  while :; do
    echo "[entrypoint] applying database migrations (attempt $attempt of $MIGRATE_ATTEMPTS)"
    if (cd /app/migrate && node node_modules/prisma/build/index.js migrate deploy); then
      break
    fi
    if [ "$attempt" -ge "$MIGRATE_ATTEMPTS" ]; then
      echo "[entrypoint] migrations failed after $MIGRATE_ATTEMPTS attempts; not starting" >&2
      exit 1
    fi
    attempt=$((attempt + 1))
    sleep "$MIGRATE_RETRY_SECONDS"
  done
fi

echo "[entrypoint] starting ${ORG_NAME:-SALT of Akagera} laundry on port ${PORT:-3000}"
exec "$@"
