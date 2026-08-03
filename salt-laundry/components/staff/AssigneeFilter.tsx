'use client'

import { Select } from '@/components/ui/Select'
import { useHousekeepers } from '@/lib/hooks/useHousekeepers'

const ALL = 'ALL'

interface Props {
  value: string | undefined
  onChange: (housekeeperId: string | undefined) => void
}

export function AssigneeFilter({ value, onChange }: Props) {
  const housekeepers = useHousekeepers()

  return (
    <Select
      value={value ?? ALL}
      onChange={(next) => onChange(next === ALL ? undefined : next)}
      options={[
        { value: ALL, label: 'All housekeepers' },
        ...housekeepers.map((h) => ({ value: h.id, label: h.name ?? h.email })),
      ]}
    />
  )
}
