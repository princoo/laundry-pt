'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userFormSchema, type UserFormValues } from '@/lib/validations/user.schema'
import { buildUserPayload } from '@/lib/utils/user'
import { Modal } from '@/components/ui/Modal'
import { UserFormFields } from '@/components/admin/UserFormFields'
import type { AdminUser } from '@/lib/hooks/useAdminUsers'

interface Props {
  user: AdminUser | null
  currentUserId: string
  onClose: () => void
  onSaved: () => void
}

export function UserFormModal({ user, currentUserId, onClose, onSaved }: Props) {
  const isNew = user === null
  const disableActiveToggle = !isNew && user.id === currentUserId
  const [submitError, setSubmitError] = useState<string | null>(null)
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      isNew,
      name: user?.name ?? '',
      email: user?.email ?? '',
      role: user?.role ?? 'STAFF',
      password: '',
      isActive: user?.isActive ?? true,
    },
  })
  async function onSubmit(values: UserFormValues) {
    setSubmitError(null)
    const payload = buildUserPayload(values)
    const url = user ? `/api/admin/users/${user.id}` : '/api/admin/users'
    const res = await fetch(url, {
      method: user ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      setSubmitError(data?.error ?? 'Could not save staff member. Try again.')
      return
    }
    onSaved()
  }
  return (
    <Modal title={isNew ? 'Add staff member' : 'Edit staff member'} onClose={onClose}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
          {submitError && (
            <div className="bg-red-50 border border-[0.5px] border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
              {submitError}
            </div>
          )}
          <UserFormFields isNew={isNew} disableActiveToggle={disableActiveToggle} />
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="border border-[0.5px] border-salt-border rounded-lg px-4 py-2 text-sm text-salt-text"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="bg-salt-navy hover:bg-salt-navy-hover transition-colors text-white rounded-lg px-4 py-2 text-sm disabled:opacity-60"
            >
              {form.formState.isSubmitting ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  )
}
