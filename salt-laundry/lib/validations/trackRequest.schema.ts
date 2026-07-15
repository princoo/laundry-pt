import { z } from 'zod'

export const trackRequestSchema = z.object({
  roomNumber: z.string().trim().min(1, 'Room number is required'),
  reference: z.string().trim().min(1, 'Reference is required'),
})

export type TrackRequestValues = z.infer<typeof trackRequestSchema>

export const trackByRoomSchema = z.object({
  roomNumber: z.string().trim().min(1, 'Room number is required'),
})

export type TrackByRoomValues = z.infer<typeof trackByRoomSchema>
