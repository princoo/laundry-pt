interface Props {
  subtitle: string
}

export function InvoiceMasthead({ subtitle }: Props) {
  return (
    <div className="mb-8">
      <h1 className="text-[22px] sm:text-2xl font-black text-salt-text">SALT of Akagera</h1>
      <div className="text-[11px] uppercase tracking-wide text-salt-text-muted mt-1.5">
        {subtitle}
      </div>
      <hr className="mt-5 border-t-[0.5px] border-salt-border" />
    </div>
  )
}
