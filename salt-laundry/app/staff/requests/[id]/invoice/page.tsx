import Link from 'next/link'
import { Inter } from 'next/font/google'
import { getRequestById } from '@/services/staffRequest.service'
import { InvoiceMasthead } from '@/components/staff/InvoiceMasthead'
import { SingleInvoiceInfoBlock } from '@/components/staff/SingleInvoiceInfoBlock'
import { InvoiceItemsTable } from '@/components/staff/InvoiceItemsTable'
import { InvoiceTotals } from '@/components/staff/InvoiceTotals'
import { InvoiceFooter } from '@/components/staff/InvoiceFooter'
import { PrintButton } from '@/components/ui/PrintButton'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const request = await getRequestById(id)

  if (!request) {
    return <p className="text-sm text-gray-600 px-4 py-6">Request not found.</p>
  }

  return (
    <div className={`${inter.variable} font-[family-name:var(--font-inter)] max-w-[680px] mx-auto px-4 py-8 print:px-0`}>
      <Link href={`/staff/requests/${id}`} className="print:hidden text-gray-500 text-sm">
        ← Back to request
      </Link>

      <div className="mt-6">
        <InvoiceMasthead subtitle="Laundry Service Invoice" />
        <SingleInvoiceInfoBlock request={request} />
        <InvoiceItemsTable items={request.items} />
        <InvoiceTotals
          grossAmount={request.grossAmount}
          vatAmount={request.vatAmount}
          totalAmount={request.totalAmount}
        />
        <InvoiceFooter />

        <div className="print:hidden mt-8 flex justify-center">
          <PrintButton />
        </div>
      </div>
    </div>
  )
}
