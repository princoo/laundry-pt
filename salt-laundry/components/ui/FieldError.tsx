interface Props {
  message?: string
}

export function FieldError({ message }: Props) {
  if (!message) return null
  return <p className="text-red-600 text-xs mt-1">{message}</p>
}
