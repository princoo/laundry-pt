import { z } from 'zod'

const newPassword = z.string().min(8, 'New password must be at least 8 characters')

// Server-side shape of PATCH /api/staff/profile — every field optional,
// the service decides which branch (details vs password) to apply.
export const updateProfileSchema = z.object({
  name: z.string().trim().optional(),
  email: z.email('Enter a valid email address').trim().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

// Client form — personal details section of the profile page.
export const profileDetailsSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.email('Enter a valid email address').trim().min(1, 'Email is required'),
})

export type ProfileDetailsValues = z.infer<typeof profileDetailsSchema>

// Client form — used by the profile page and the forced change-password page.
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword,
    confirmPassword: z.string().min(1, 'Confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>
