import { z } from 'zod'
import { roomNumberSchema } from '@/lib/validations/room.schema'

export const trackRequestSchema = z.object({
  roomNumber: roomNumberSchema,
  reference: z.string().trim().min(1, 'Reference is required'),
})

export type TrackRequestValues = z.infer<typeof trackRequestSchema>

export const trackByRoomSchema = z.object({
  roomNumber: roomNumberSchema,
})

export type TrackByRoomValues = z.infer<typeof trackByRoomSchema>
