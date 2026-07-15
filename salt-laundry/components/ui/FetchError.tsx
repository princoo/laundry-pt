interface Props {
  message?: string
  onRetry: () => void
}

export function FetchError({ message = 'Failed to load.', onRetry }: Props) {
  return (
    <div className="bg-red-50 border border-[0.5px] border-red-200 rounded-xl p-6 text-center">
      <p className="text-sm text-red-700 mb-3">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="bg-white border border-[0.5px] border-red-300 text-red-700 rounded-lg px-4 py-2 text-sm font-medium hover:bg-red-50 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
