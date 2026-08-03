import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getRequestById } from '@/services/staffRequest.service'
import { InvoiceMasthead } from '@/components/staff/InvoiceMasthead'
import { SingleInvoiceInfoBlock } from '@/components/staff/SingleInvoiceInfoBlock'
import { InvoiceItemsTable } from '@/components/staff/InvoiceItemsTable'
import { InvoiceTotals } from '@/components/staff/InvoiceTotals'
import { InvoiceFooter } from '@/components/staff/InvoiceFooter'
import { InvoiceCard } from '@/components/staff/InvoiceCard'
import { formatReference } from '@/lib/utils/formatting'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const request = await getRequestById(id)

  return {
    title: request ? `Invoice — Room ${request.roomNumber}` : 'Invoice',
    robots: { index: false, follow: false },
  }
}

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const request = await getRequestById(id)

  if (!request) {
    return <p className="text-sm text-salt-text-sec px-4 py-6">Request not found.</p>
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10 print:px-0 print:py-0">
      <Link
        href={`/staff/requests/${id}`}
        className="print:hidden flex items-center gap-1.5 text-salt-text-sec text-sm hover:text-salt-text transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to request
      </Link>

      <InvoiceCard filename={`${formatReference(request.seq, request.createdAt)}.pdf`}>
        <InvoiceMasthead subtitle="Laundry service invoice" />
        <SingleInvoiceInfoBlock request={request} />
        <InvoiceItemsTable items={request.items} />
        <InvoiceTotals
          grossAmount={request.grossAmount}
          vatAmount={request.vatAmount}
          totalAmount={request.totalAmount}
        />
        <InvoiceFooter />
      </InvoiceCard>
    </div>
  )
}
