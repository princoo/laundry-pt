import { z } from 'zod'

// The two booleans on a staff record the laundry owns. Every other field
// arrives from SOA and is never written here, so these are the only staff
// payloads there are.
export const availabilityUpdateSchema = z.object({
  isAvailable: z.boolean({ error: 'isAvailable must be true or false' }),
})

export type AvailabilityUpdateInput = z.infer<typeof availabilityUpdateSchema>

export const housekeeperUpdateSchema = z.object({
  isHousekeeper: z.boolean({ error: 'isHousekeeper must be true or false' }),
})

export type HousekeeperUpdateInput = z.infer<typeof housekeeperUpdateSchema>
