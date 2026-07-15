'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ServiceType } from '@prisma/client'
import { GuestNav } from '@/components/guest/GuestNav'
import { GuestFooter } from '@/components/guest/GuestFooter'
import { GuestFormHeader } from '@/components/guest/GuestFormHeader'
import { GuestFormFields } from '@/components/guest/GuestFormFields'
import { OrderSummary } from '@/components/guest/OrderSummary'
import { MobileSubmitBar } from '@/components/guest/MobileSubmitBar'
import { useItems } from '@/lib/hooks/useItems'
import { useSubmitRequest } from '@/lib/hooks/useSubmitRequest'
import { buildOrderSummary } from '@/lib/utils/orderSummary'
import { guestDetailsSchema, type GuestDetailsValues } from '@/lib/validations/guestRequest.schema'

export default function Home() {
  const [serviceType, setServiceType] = useState<ServiceType>('NORMAL')
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [isExpress, setIsExpress] = useState(false)
  const [prevServiceType, setPrevServiceType] = useState(serviceType)

  const methods = useForm<GuestDetailsValues>({
    resolver: zodResolver(guestDetailsSchema),
    defaultValues: { roomNumber: '', guestName: '', note: '', isHanger: false },
  })
  const roomNumber = methods.watch('roomNumber')

  const { items, isLoading, error: itemsError, refetch: refetchItems } = useItems(serviceType)
  const { submit, isSubmitting, submitError, dismissError } = useSubmitRequest()

  if (serviceType !== prevServiceType) {
    setPrevServiceType(serviceType)
    setQuantities({})
    setIsExpress(false)
  }
  const handleQuantityChange = (id: string, quantity: number) => {
    setQuantities((prev) => ({ ...prev, [id]: quantity }))
  }

  const { selectedLines, gross, vat, total } = buildOrderSummary(items, quantities, isExpress)
  const canSubmit = roomNumber.trim() !== '' && selectedLines.length > 0

  const onSubmit = methods.handleSubmit((details) =>
    submit({ ...details, serviceType, isExpress, items, quantities })
  )

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-salt-cream">
        <GuestNav active="new" />

        <div className="max-w-5xl mx-auto px-4">
          <GuestFormHeader />

          <div className="flex flex-col md:flex-row gap-6 pb-24 md:pb-10">
            <GuestFormFields
              serviceType={serviceType}
              onServiceTypeChange={setServiceType}
              items={items}
              quantities={quantities}
              onQuantityChange={handleQuantityChange}
              isLoading={isLoading}
              itemsError={itemsError}
              onRetryItems={refetchItems}
            />

            <div className="w-full md:w-80 md:sticky md:top-20 md:self-start">
              <OrderSummary
                selectedLines={selectedLines}
                gross={gross}
                vat={vat}
                total={total}
                serviceType={serviceType}
                isExpress={isExpress}
                onIsExpressChange={setIsExpress}
                canSubmit={canSubmit}
                submission={{ isSubmitting, submitError, onDismissError: dismissError, onSubmit }}
              />
            </div>
          </div>
        </div>

        <MobileSubmitBar
          total={total}
          canSubmit={canSubmit}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
        />

        <GuestFooter />
      </div>
    </FormProvider>
  )
}
