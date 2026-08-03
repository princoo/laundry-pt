import { z } from 'zod'

const newPassword = z.string().min(8, 'Password must be at least 8 characters')

// Shared by the forgot-password form and POST /api/auth/forgot-password.
export const forgotPasswordSchema = z.object({
  email: z.email('Enter a valid email address').trim().min(1, 'Email is required'),
})

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

// Server shape of POST /api/auth/reset-password.
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword,
})

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>

// Client form — the token comes from the URL, not the form fields.
export const resetPasswordFormSchema = z
  .object({
    newPassword,
    confirmPassword: z.string().min(1, 'Confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>

// Shared by the admin reset modal and POST /api/admin/users/[id]/reset-password.
export const adminResetPasswordSchema = z.object({
  temporaryPassword: z.string().min(8, 'Password must be at least 8 characters'),
})

export type AdminResetPasswordValues = z.infer<typeof adminResetPasswordSchema>
