interface Props {
  rows?: number
  height?: string
  rounded?: string
}

export function LoadingSkeleton({ rows = 3, height = 'h-12', rounded = 'rounded-lg' }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={`${height} ${rounded} bg-salt-border/40 animate-pulse`} />
      ))}
    </div>
  )
}
