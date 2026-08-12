// Monogram for the profile avatar. Falls back to the email for SOA accounts
// that arrive without a name on them.
export function getInitials(name: string | null, email: string): string {
  const trimmed = name?.trim()
  if (!trimmed) return (email.trim()[0] ?? '?').toUpperCase()

  const words = trimmed.split(/\s+/)
  const last = words.length > 1 ? words[words.length - 1][0] : ''
  return (words[0][0] + last).toUpperCase()
}

// Taking someone out of the assignment picker — off shift, or no longer a
// housekeeper — does not take their work off them. Say what stays behind
// rather than leaving a supervisor to find out later. Null when there is
// nothing to warn about.
export function openTasksWarning(openTasks: number, lead: string): string | null {
  if (openTasks === 0) return null
  const tasks = `${openTasks} open ${openTasks === 1 ? 'task' : 'tasks'}`
  return `${lead}. Their ${tasks} stay assigned — reassign them if someone else should take over.`
}

// SOA sends the two halves of a name separately; the laundry stores the joined
// form as well so the fifteen or so selects and components that read `name`
// keep working. Null rather than an empty string when neither half is sent, so
// "no name" stays a single representable state.
export function fullName(
  firstName: string | null | undefined,
  secondName: string | null | undefined
): string | null {
  const joined = [firstName, secondName]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(' ')
  return joined || null
}
