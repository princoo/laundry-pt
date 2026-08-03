import { z } from 'zod'
import { REQUEST_STATUSES } from '@/lib/constants/statuses'

export const updateStatusSchema = z.object({
  status: z.enum(REQUEST_STATUSES),
})

export type UpdateStatusInput = z.infer<typeof updateStatusSchema>
