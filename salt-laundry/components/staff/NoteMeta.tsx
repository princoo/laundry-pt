import { ROLE_DOT_CLASSES, ROLE_LABELS } from '@/lib/constants/roles'
import { formatTimestamp } from '@/lib/utils/formatting'
import type { RequestNote } from '@/lib/types/request'

interface Props {
  author: RequestNote['author']
  createdAt: string
}

// "Jean Baptiste · Housekeeper · 3 Jul, 09:15" — author is null for notes
// written before authorship existed and for the automatic guest-edit note.
export function NoteMeta({ author, createdAt }: Props) {
  return (
    <p className="text-[11px] text-salt-text-muted mt-1">
      <span
        className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle ${
          author ? ROLE_DOT_CLASSES[author.role] : 'bg-salt-border'
        }`}
      />
      {author?.name || 'Unknown'}
      {author && ` · ${ROLE_LABELS[author.role]}`}
      {` · ${formatTimestamp(createdAt)}`}
    </p>
  )
}
