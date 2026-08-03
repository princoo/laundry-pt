import crypto from 'crypto'

const RESET_WINDOW_MS = 15 * 60 * 1000

export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function generateResetExpiry(): Date {
  return new Date(Date.now() + RESET_WINDOW_MS)
}

export function isTokenExpired(expiry: Date | null): boolean {
  if (!expiry) return true
  return new Date() > expiry
}
