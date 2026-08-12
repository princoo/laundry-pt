import { ROLE_DOT_CLASSES, ROLE_LABELS, DEFAULT_ROLE_DOT_CLASS } from '@/lib/constants/roles'
import { formatTimestamp } from '@/lib/utils/formatting'
import type { RequestNote } from '@/lib/types/request'

interface Props {
  author: RequestNote['author']
  createdAt: string
}

// "Jean Baptiste · Housekeeper · 3 Jul, 09:15" — author is null for notes
// written before authorship existed and for the automatic guest-edit note.
// A user can hold several SOA roles; the first one is enough to place them in
// a list of notes, and the rest would crowd the line.
export function NoteMeta({ author, createdAt }: Props) {
  const roleName = author?.roleNames[0]

  return (
    <p className="text-[11px] text-salt-text-muted mt-1">
      <span
        className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle ${
          (roleName && ROLE_DOT_CLASSES[roleName]) ?? DEFAULT_ROLE_DOT_CLASS
        }`}
      />
      {author?.name || 'Unknown'}
      {roleName && ` · ${ROLE_LABELS[roleName] ?? roleName}`}
      {` · ${formatTimestamp(createdAt)}`}
    </p>
  )
}
