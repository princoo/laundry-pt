import { z } from 'zod'

// A reason is required. A flag without one tells whoever has to fix it nothing,
// and it is the only part of the flag that reaches the staff notes trail.
export const flagRequestSchema = z.object({
  reason: z
    .string({ error: 'Say what does not match' })
    .trim()
    .min(5, 'Say briefly what does not match')
    .max(300, 'Keep the reason short'),
})

export type FlagRequestInput = z.infer<typeof flagRequestSchema>
