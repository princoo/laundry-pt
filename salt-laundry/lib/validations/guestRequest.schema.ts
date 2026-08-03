import { z } from 'zod'
import { SERVICE_TYPES } from '@/lib/constants/services'

export const guestDetailsSchema = z.object({
  roomNumber: z.string().trim().min(1, 'Room number is required'),
  guestName: z.string().trim().optional(),
  note: z.string().trim().optional(),
  isHanger: z.boolean(),
})

export type GuestDetailsValues = z.infer<typeof guestDetailsSchema>

export const requestItemSchema = z.object({
  laundryItemId: z.string().min(1, 'Item is required'),
  quantity: z.int().min(1, 'Quantity must be at least 1'),
})

export const createGuestRequestSchema = guestDetailsSchema.extend({
  serviceType: z.enum(SERVICE_TYPES),
  isExpress: z.boolean(),
  items: z.array(requestItemSchema).min(1, 'Select at least one item'),
})

export type CreateGuestRequestInput = z.infer<typeof createGuestRequestSchema>
