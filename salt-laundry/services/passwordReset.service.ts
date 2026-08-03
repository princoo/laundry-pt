import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { generateResetToken, generateResetExpiry, isTokenExpired } from '@/lib/utils/token'

const BCRYPT_ROUNDS = 12

// Stores a reset token on the user record and returns it so the caller can
// email it. Returns null when the email is unknown or inactive — the caller
// must still answer with the same message, so accounts can't be enumerated.
export async function createPasswordResetToken(email: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: { id: true, name: true, email: true, isActive: true },
  })
  if (!user || !user.isActive) return null

  const token = generateResetToken()
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordResetToken: token, passwordResetExpiry: generateResetExpiry() },
  })

  return { token, name: user.name ?? 'Staff member', email: user.email }
}

export async function resetPasswordWithToken(token: string, newPassword: string) {
  const user = await prisma.user.findUnique({
    where: { passwordResetToken: token },
    select: { id: true, passwordResetExpiry: true },
  })
  if (!user) throw new Error('INVALID_TOKEN')
  if (isTokenExpired(user.passwordResetExpiry)) throw new Error('EXPIRED_TOKEN')

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: await bcrypt.hash(newPassword, BCRYPT_ROUNDS),
      mustChangePassword: false,
      passwordResetToken: null, // consumed — the link cannot be replayed
      passwordResetExpiry: null,
    },
  })
}

// Admin sets a temporary password and forces a change on next login.
export async function adminResetPassword(targetUserId: string, temporaryPassword: string) {
  const target = await prisma.user.findUnique({ where: { id: targetUserId }, select: { id: true } })
  if (!target) return null

  await prisma.user.update({
    where: { id: targetUserId },
    data: {
      password: await bcrypt.hash(temporaryPassword, BCRYPT_ROUNDS),
      mustChangePassword: true,
      passwordResetToken: null, // clear any pending email reset
      passwordResetExpiry: null,
    },
  })
  return target
}
