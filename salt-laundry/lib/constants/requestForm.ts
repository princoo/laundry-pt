import type { RequestFormMode } from '@/lib/types/guestOrder'

// Wording for the one submit control the form has, in whichever job it's doing.
export const SAVE_LABELS: Record<
  RequestFormMode,
  { idle: string; pending: string; hint: string }
> = {
  create: {
    idle: 'Submit request',
    pending: 'Submitting…',
    hint: 'Enter your room number and select at least one item.',
  },
  edit: {
    idle: 'Save changes',
    pending: 'Saving…',
    hint: 'Select at least one item.',
  },
}
