'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AccessDenied } from '@/components/ui/AccessDenied'
import { ItemDetailTopBar } from '@/components/admin/ItemDetailTopBar'
import { ItemDetailCard } from '@/components/admin/ItemDetailCard'
import { ItemPriceGrid } from '@/components/admin/ItemPriceGrid'
import { ItemUsageStats } from '@/components/admin/ItemUsageStats'
import { ItemFormModal } from '@/components/admin/ItemFormModal'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { ErrorToast } from '@/components/ui/ErrorToast'
import { FetchError } from '@/components/ui/FetchError'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { useAdminItemDetail } from '@/lib/hooks/useAdminItemDetail'
import { usePermissions } from '@/lib/hooks/usePermissions'

export default function StaffItemDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { can, isLoading: isSessionLoading } = usePermissions()
  const {
    item, isLoading, notFound, fetchError, isUpdating, actionError,
    toggleActive, removeItem, refetch, clearError,
  } = useAdminItemDetail(id)
  const [isEditing, setIsEditing] = useState(false)
  const [isConfirmingRemove, setIsConfirmingRemove] = useState(false)
  if (!isSessionLoading && !can('LAUNDRY_REQUEST_ITEMS_CATALOGUE_VIEW')) {
    return <AccessDenied />
  }

  const handleRemove = async () => {
    setIsConfirmingRemove(false)
    if (await removeItem()) router.push('/staff/items')
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <ItemDetailTopBar />

      {isLoading && <LoadingSkeleton rows={3} height="h-24" rounded="rounded-xl" />}
      {!isLoading && fetchError && <FetchError message={fetchError} onRetry={refetch} />}
      {!isLoading && !fetchError && notFound && (
        <p className="text-sm text-salt-text-sec mt-6">Item not found.</p>
      )}
      {!isLoading && !fetchError && item && (
        <div className="flex flex-col gap-4">
          <ItemDetailCard
            item={item}
            isUpdating={isUpdating}
            onToggle={toggleActive}
            onEdit={() => setIsEditing(true)}
            onRemove={() => setIsConfirmingRemove(true)}
          />
          <ItemPriceGrid item={item} />
          <ItemUsageStats item={item} />
        </div>
      )}

      {isEditing && item && (
        <ItemFormModal
          item={item}
          onClose={() => setIsEditing(false)}
          onSaved={() => { setIsEditing(false); refetch() }}
        />
      )}
      {isConfirmingRemove && (
        <ConfirmModal
          title="Remove item"
          message="Remove this item from the catalogue? Guests will no longer be able to request it."
          confirmLabel="Remove item"
          isDestructive
          onConfirm={handleRemove}
          onCancel={() => setIsConfirmingRemove(false)}
        />
      )}
      <ErrorToast message={actionError} onDismiss={clearError} />
    </div>
  )
}
