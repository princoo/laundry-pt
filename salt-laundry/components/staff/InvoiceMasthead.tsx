interface Props {
  subtitle: string
}

export function InvoiceMasthead({ subtitle }: Props) {
  return (
    <div className="mb-6">
      <div className="text-[20px] font-medium text-black">SALT of Akagera</div>
      <div className="text-sm text-gray-500 mt-0.5">{subtitle}</div>
      <hr className="mt-4 border-t border-gray-300" />
    </div>
  )
}
