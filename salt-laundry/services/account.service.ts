import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import type { UpdateProfileInput } from '@/lib/validations/profile.schema'

const BCRYPT_ROUNDS = 12

const OWN_PROFILE_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  mustChangePassword: true,
} as const

export async function getOwnProfile(userId: string) {
  return prisma.user.findUnique({ where: { id: userId }, select: OWN_PROFILE_SELECT })
}

// Updates the requesting user's own profile. Role is never touched here —
// a user cannot promote themselves.
export async function updateOwnProfile(userId: string, data: UpdateProfileInput) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error('USER_NOT_FOUND')

  const update: Record<string, unknown> = {}

  if (data.name?.trim()) update.name = data.name.trim()
  if (data.email?.trim()) update.email = data.email.trim().toLowerCase()

  if (data.newPassword) {
    if (!data.currentPassword) throw new Error('Current password is required')
    const valid = await bcrypt.compare(data.currentPassword, user.password)
    if (!valid) throw new Error('WRONG_PASSWORD')
    if (data.newPassword.length < 8) throw new Error('New password must be at least 8 characters')
    update.password = await bcrypt.hash(data.newPassword, BCRYPT_ROUNDS)
    update.mustChangePassword = false // cleared once the user picks their own password
  }

  if (Object.keys(update).length === 0) throw new Error('No changes provided')

  try {
    return await prisma.user.update({
      where: { id: userId },
      data: update,
      select: OWN_PROFILE_SELECT,
    })
  } catch (error) {
    // Unique constraint on email
    if ((error as { code?: string }).code === 'P2002') throw new Error('EMAIL_TAKEN')
    throw error
  }
}
