interface Props {
  label: string
  value: string
  mono?: boolean
}

export function InvoiceField({ label, value, mono = false }: Props) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-salt-text-muted">{label}</div>
      <div className={`mt-0.5 text-salt-text ${mono ? 'font-mono text-[13px]' : ''}`}>{value}</div>
    </div>
  )
}
