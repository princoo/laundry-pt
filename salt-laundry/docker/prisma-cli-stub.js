// Stands in for the parts of the Prisma CLI's dependency tree the image does
// not ship: Prisma Studio, `prisma dev` (an embedded Postgres) and the MySQL
// and postgres.js drivers, 200 MB that `migrate deploy` never calls. The CLI
// bundle requires them at start-up, so the module must exist and tolerate any
// property access or call without doing anything. The Dockerfile's self-check
// proves `migrate deploy` still works with these in place.
const noop = new Proxy(function stub() {}, {
  get: (_target, key) => (key === Symbol.toPrimitive ? () => "" : noop),
  apply: () => noop,
  construct: () => noop,
});
module.exports = noop;
