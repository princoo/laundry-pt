import { FileBarChart } from 'lucide-react'

export function ReportsEmptyState() {
  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm py-16 px-6 text-center">
      <FileBarChart className="w-10 h-10 text-salt-text-muted mx-auto mb-3" />
      <p className="text-base text-salt-text-sec">No delivered requests in this period</p>
      <p className="text-sm text-salt-text-muted mt-1">Try a wider date range or a different quick filter.</p>
    </div>
  )
}
