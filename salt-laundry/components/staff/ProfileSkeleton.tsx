// Mirrors the real profile layout so the page does not reflow once it loads.
export function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div className="h-[88px] rounded-xl bg-salt-border/40 animate-pulse" />
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
        <div className="h-64 rounded-xl bg-salt-border/40 animate-pulse" />
        <div className="h-96 rounded-xl bg-salt-border/40 animate-pulse" />
      </div>
    </div>
  )
}
