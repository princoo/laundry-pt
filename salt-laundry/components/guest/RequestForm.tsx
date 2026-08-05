'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GuestFormFields } from '@/components/guest/GuestFormFields'
import { OrderSummary } from '@/components/guest/OrderSummary'
import { MobileSubmitBar } from '@/components/guest/MobileSubmitBar'
import { useItems } from '@/lib/hooks/useItems'
import { useSaveRequest } from '@/lib/hooks/useSaveRequest'
import { useOrderSelections } from '@/lib/hooks/useOrderSelections'
import { buildOrderSummary } from '@/lib/utils/orderSummary'
import { EMPTY_DRAFT } from '@/lib/utils/guestDraft'
import { guestDetailsSchema, type GuestDetailsValues } from '@/lib/validations/guestRequest.schema'
import type { GuestOrderDraft, RequestFormMode } from '@/lib/types/guestOrder'

interface Props {
  mode: RequestFormMode
  requestId?: string
  initialData?: GuestOrderDraft   // edit mode only, and only once loaded
}

export function RequestForm({ mode, requestId, initialData }: Props) {
  const draft = initialData ?? EMPTY_DRAFT
  const [isExpress, setIsExpress] = useState(draft.isExpress)
  const { items, isLoading, error: itemsError, refetch: refetchItems } = useItems()
  const {
    defaultServiceType, changeDefaultService, selections, changeQuantity, changeService,
  } = useOrderSelections(items, draft.selections)

  // onChange mode so formState.isValid tracks the schema live — the submit gate
  // is the schema itself, not a hand-rolled field check that drifts from it.
  const methods = useForm<GuestDetailsValues>({
    resolver: zodResolver(guestDetailsSchema),
    mode: 'onChange',
    defaultValues: {
      roomNumber: draft.roomNumber, guestName: draft.guestName,
      note: draft.note, isHanger: draft.isHanger,
    },
  })
  const { save, isSaving, saveError, dismissError } = useSaveRequest(mode, requestId)

  const { selectedLines, gross, vat, total } = buildOrderSummary(items, selections, isExpress)
  const canSubmit = methods.formState.isValid && selectedLines.length > 0

  const onSubmit = methods.handleSubmit((details) =>
    save({ ...details, isExpress, selections })
  )

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        <GuestFormFields
          defaultServiceType={defaultServiceType}
          onDefaultServiceTypeChange={changeDefaultService}
          items={items} selections={selections}
          onQuantityChange={changeQuantity} onServiceChange={changeService}
          isLoading={isLoading} itemsError={itemsError} onRetryItems={refetchItems}
          // The room a request belongs to is fixed once it exists.
          readOnlyRoom={mode === 'edit' ? draft.roomNumber : undefined}
        />
        <div className="w-full lg:w-80 lg:sticky lg:top-20 lg:self-start">
          <OrderSummary
            selectedLines={selectedLines}
            gross={gross} vat={vat} total={total}
            isExpress={isExpress} onIsExpressChange={setIsExpress}
            canSubmit={canSubmit}
            submission={{
              mode, isSaving, saveError, onDismissError: dismissError, onSubmit,
            }}
          />
        </div>
      </div>
      <MobileSubmitBar
        mode={mode} total={total} canSubmit={canSubmit}
        isSaving={isSaving} onSubmit={onSubmit}
      />
    </FormProvider>
  )
}
