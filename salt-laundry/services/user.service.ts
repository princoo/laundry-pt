import { prisma } from '@/lib/prisma'
import { pageSlice, type PageParams } from '@/lib/utils/pagination'

// Everything here is mirrored from SOA — writes live in soaUser.service.ts.
const PUBLIC_USER_SELECT = {
  id: true,
  staffId: true,
  email: true,
  name: true,
  phoneNumber: true,
  departmentName: true,
  roleNames: true,
  isHousekeeper: true,
  isActive: true,
  isAvailable: true,
  createdAt: true,
} as const

// The signed-in user's own record, for the profile page. Read only — SOA owns
// every field on it, so there is no matching write.
export async function getOwnProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true, staffId: true, name: true, email: true,
      phoneNumber: true, departmentName: true, roleNames: true,
    },
  })
}

// createdAt can collide on seeded or bulk-created accounts, so id makes the
// ordering total and stops a row appearing on two pages.
export async function getAllUsers(pageParams: PageParams) {
  const [users, total, activeCount] = await Promise.all([
    prisma.user.findMany({
      select: PUBLIC_USER_SELECT,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      ...pageSlice(pageParams),
    }),
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
  ])
  return { users, total, activeCount }
}

// Off-shift housekeepers are returned too, marked by isAvailable, rather than
// hidden: a supervisor assigning work needs to see that the person they were
// about to pick is off shift, not silently not find them.
export async function getActiveHousekeepers() {
  return prisma.user.findMany({
    where: { isHousekeeper: true, isActive: true },
    select: { id: true, name: true, email: true, isAvailable: true },
    orderBy: { name: 'asc' },
  })
}

export async function getActiveHousekeeperById(id: string) {
  return prisma.user.findFirst({
    where: { id, isHousekeeper: true, isActive: true },
    select: { id: true, name: true, isAvailable: true },
  })
}
