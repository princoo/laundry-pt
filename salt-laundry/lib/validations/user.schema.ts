import { z } from 'zod'
import { ROLES } from '@/lib/constants/roles'

export const createUserSchema = z.object({
  email: z.email('Enter a valid email address').trim().min(1, 'Email is required'),
  name: z.string().trim().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(ROLES),
})

export type CreateUserInput = z.infer<typeof createUserSchema>

export const updateUserSchema = z.object({
  name: z.string().trim().optional(),
  email: z.email('Enter a valid email address').trim().optional(),
  role: z.enum(ROLES).optional(),
  isActive: z.boolean().optional(),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>

export const userFormSchema = z
  .object({
    isNew: z.boolean(),
    name: z.string().trim().optional(),
    email: z.email('Enter a valid email address').trim().min(1, 'Email is required'),
    role: z.enum(ROLES),
    password: z.string().optional(),
    isActive: z.boolean(),
  })
  .refine((data) => !data.isNew || (data.password?.length ?? 0) >= 8, {
    message: 'Password must be at least 8 characters',
    path: ['password'],
  })

export type UserFormValues = z.infer<typeof userFormSchema>
