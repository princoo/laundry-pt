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
  serviceType: z.enum(SERVICE_TYPES),
  quantity: z.int().min(1, 'Quantity must be at least 1'),
})

// isExpress stays request-level: it's priority return for the whole order,
// not a treatment applied to any one item.
export const createGuestRequestSchema = guestDetailsSchema.extend({
  isExpress: z.boolean(),
  items: z.array(requestItemSchema).min(1, 'Select at least one item'),
})

export type CreateGuestRequestInput = z.infer<typeof createGuestRequestSchema>

// A guest edit carries everything the create payload does except roomNumber:
// changing the room would hand the order to a different guest.
export const editGuestRequestSchema = createGuestRequestSchema.omit({ roomNumber: true })

export type EditGuestRequestInput = z.infer<typeof editGuestRequestSchema>
