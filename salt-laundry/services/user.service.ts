import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import type { CreateUserInput, UpdateUserInput } from '@/lib/validations/user.schema'

const BCRYPT_ROUNDS = 12

const PUBLIC_USER_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  isActive: true,
  isAvailable: true,
  createdAt: true,
} as const

export async function getAllUsers() {
  return prisma.user.findMany({
    select: PUBLIC_USER_SELECT,
    orderBy: { createdAt: 'desc' },
  })
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email: email.toLowerCase() } })
}

export async function createUser(data: CreateUserInput) {
  const hashedPassword = await bcrypt.hash(data.password, BCRYPT_ROUNDS)
  return prisma.user.create({
    data: {
      email: data.email.toLowerCase(),
      name: data.name,
      password: hashedPassword,
      role: data.role,
    },
    select: PUBLIC_USER_SELECT,
  })
}

export async function updateUser(id: string, data: UpdateUserInput) {
  const existing = await prisma.user.findUnique({ where: { id } })
  if (!existing) return null
  return prisma.user.update({
    where: { id },
    data: { ...data, email: data.email?.toLowerCase() },
    select: PUBLIC_USER_SELECT,
  })
}

export async function getActiveHousekeepers() {
  return prisma.user.findMany({
    where: { role: 'HOUSEKEEPER', isActive: true, isAvailable: true },
    select: { id: true, name: true, email: true },
    orderBy: { name: 'asc' },
  })
}

export async function getActiveHousekeeperById(id: string) {
  return prisma.user.findFirst({
    where: { id, role: 'HOUSEKEEPER', isActive: true, isAvailable: true },
    select: { id: true, name: true },
  })
}
