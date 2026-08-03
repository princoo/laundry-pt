'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileDetailsSchema, type ProfileDetailsValues } from '@/lib/validations/profile.schema'
import { ProfileDetailsFields } from '@/components/staff/ProfileDetailsFields'
import { FormAlert } from '@/components/ui/FormAlert'
import { SectionCard } from '@/components/ui/SectionCard'
import { CARD_ACTION_CLASSES } from '@/lib/constants/formStyles'
import type { OwnProfile } from '@/lib/hooks/useProfile'

interface Props {
  profile: OwnProfile
  onSaved: () => void
}

export function ProfileDetailsCard({ profile, onSaved }: Props) {
  const [status, setStatus] = useState<{ message: string; variant: 'error' | 'success' } | null>(null)
  const { update } = useSession()
  const methods = useForm<ProfileDetailsValues>({
    resolver: zodResolver(profileDetailsSchema),
    defaultValues: { name: profile.name ?? '', email: profile.email },
  })
  const { isSubmitting, isDirty } = methods.formState

  async function onSubmit(values: ProfileDetailsValues) {
    const res = await fetch('/api/staff/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      setStatus({ message: data?.error ?? 'Could not save your details.', variant: 'error' })
      return
    }
    setStatus({ message: 'Details saved.', variant: 'success' })
    // Clears the dirty flag, which is what retires the success message the
    // moment the user starts editing again.
    methods.reset(values)
    // Payload required — see ChangePasswordForm. The jwt callback re-reads the
    // record either way; this keeps the nav's name in step with it.
    await update(values)
    onSaved()
  }

  return (
    <SectionCard
      title="Personal details"
      description="Your name appears on the requests assigned to you."
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          {status && (status.variant === 'error' || !isDirty) && (
            <FormAlert message={status.message} variant={status.variant} />
          )}
          <ProfileDetailsFields />
          <button type="submit" disabled={isSubmitting} className={CARD_ACTION_CLASSES}>
            {isSubmitting ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </FormProvider>
    </SectionCard>
  )
}
