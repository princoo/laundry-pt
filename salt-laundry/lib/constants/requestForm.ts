import type { RequestFormMode, RoomLockReason } from '@/lib/types/guestOrder'

// Why the room field is read-only, told to the guest looking at it.
export const ROOM_LOCK_HINTS: Record<RoomLockReason, string> = {
  scan: 'Your room number is scanned.',
  edit: "The room on a request can't be changed.",
}

// Wording for the one submit control the form has, in whichever job it's doing.
export const SAVE_LABELS: Record<RequestFormMode, { idle: string; pending: string }> = {
  create: { idle: 'Submit request', pending: 'Submitting…' },
  edit: { idle: 'Save changes', pending: 'Saving…' },
}

// What's still missing before the form can be submitted. A locked room is never
// the blocker, so it's only named when the guest is being asked for it.
export const SUBMIT_HINTS = {
  asksRoom: 'Enter your room number and select at least one item.',
  roomKnown: 'Select at least one item.',
}
