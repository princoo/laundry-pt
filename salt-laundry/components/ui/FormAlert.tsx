interface Props {
  message?: string | null
  variant?: 'error' | 'success'
}

const VARIANT_CLASSES = {
  error: 'bg-red-50 border-red-200 text-red-700',
  success: 'bg-salt-green-light border-salt-green text-salt-green',
} as const

export function FormAlert({ message, variant = 'error' }: Props) {
  if (!message) return null
  return (
    <div
      className={`${VARIANT_CLASSES[variant]} border border-[0.5px] text-sm rounded-lg px-4 py-3`}
    >
      {message}
    </div>
  )
}
