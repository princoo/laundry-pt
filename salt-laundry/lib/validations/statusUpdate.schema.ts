import { z } from 'zod'
import { RequestStatus } from '@prisma/client'

export const updateStatusSchema = z.object({
  status: z.enum(RequestStatus),
})

export type UpdateStatusInput = z.infer<typeof updateStatusSchema>
