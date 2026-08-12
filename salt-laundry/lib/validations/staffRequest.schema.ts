import { z } from 'zod'
import { editGuestRequestSchema } from '@/lib/validations/guestRequest.schema'

// Built on the guest edit schema so both correction paths hold the order to
// identical rules — same name validation, same item shape, same "at least one
// item". The only addition is why the correction was made, which rides into the
// revision record and the staff notes.
export const editStaffRequestSchema = editGuestRequestSchema.extend({
  reason: z.string().trim().max(300, 'Keep the reason short').optional(),
})

export type EditStaffRequestInput = z.infer<typeof editStaffRequestSchema>
