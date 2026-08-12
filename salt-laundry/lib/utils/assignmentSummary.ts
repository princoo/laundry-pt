import { timeAgo } from '@/lib/utils/formatting'

// The one line under a queue card that answers "whose is this?".
//
// A housekeeper looking at their own queue already knows the answer, so the
// slot is spent on the clock that is actually new to them: when the task
// reached them, which is a different moment from when the guest submitted it.
// Every other queue keeps the name, because that is the open question there.
export function assignmentSummary(
  isMyTask: boolean,
  assignedTo: { name: string | null } | null,
  assignedAt: string | null,
): string {
  if (isMyTask) {
    return assignedAt ? `Assigned to you ${timeAgo(assignedAt)}` : 'Assigned to you'
  }
  if (assignedTo) return `Assigned to: ${assignedTo.name}`
  return 'Not assigned yet'
}
