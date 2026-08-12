import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
  adapter?: PrismaPg
}

//  Keep the pool small so
// parallel queries queue instead of exhausting it, and reuse it across HMR.
const POOL_MAX = Number(process.env.DB_POOL_MAX ?? 3)

function createAdapter() {
  console.log(`[prisma] new pool pid=${process.pid} max=${POOL_MAX}`)
  return new PrismaPg({
    connectionString: process.env.DATABASE_URL,
    max: POOL_MAX,
    idleTimeoutMillis: 5_000,
    connectionTimeoutMillis: 15_000,
    allowExitOnIdle: true,
  })
}

const adapter = globalForPrisma.adapter ?? createAdapter()

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
  globalForPrisma.adapter = adapter
}
