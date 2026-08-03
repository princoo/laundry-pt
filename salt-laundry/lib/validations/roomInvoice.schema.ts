import { z } from 'zod'
import { ServiceType } from '@prisma/client'

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date')

export const roomInvoiceQuerySchema = z.object({
  room: z.string().trim().min(1, 'Room number is required'),
  guestName: z.string().trim().optional(),
  serviceType: z.enum(ServiceType).optional(),
  express: z.enum(['ALL', 'EXPRESS', 'STANDARD']).default('ALL'),
  from: isoDate.optional(),
  to: isoDate.optional(),
})

export type RoomInvoiceQuery = z.infer<typeof roomInvoiceQuerySchema>
