import { Zap } from 'lucide-react'

export function ExpressBadge() {
  return (
    <span className="flex items-center gap-1 bg-amber-50 text-amber-700 text-xs px-2 py-0.5 rounded-full">
      <Zap className="w-3 h-3" /> Express
    </span>
  )
}
