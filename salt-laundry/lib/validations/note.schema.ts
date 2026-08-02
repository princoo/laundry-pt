import { z } from 'zod'

export const createNoteSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Note content cannot be empty')
    .max(500, 'Note content must be under 500 characters'),
})

export type CreateNoteInput = z.infer<typeof createNoteSchema>
