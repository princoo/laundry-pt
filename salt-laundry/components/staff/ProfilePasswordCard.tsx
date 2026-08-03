'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { changePasswordSchema, type ChangePasswordValues } from '@/lib/validations/profile.schema'
import { useChangePassword } from '@/lib/hooks/useChangePassword'
import { getPasswordChecks } from '@/lib/utils/password'
import { CurrentPasswordField } from '@/components/staff/CurrentPasswordField'
import { NewPasswordFields } from '@/components/staff/NewPasswordFields'
import { PasswordChecklist } from '@/components/ui/PasswordChecklist'
import { FormAlert } from '@/components/ui/FormAlert'
import { SectionCard } from '@/components/ui/SectionCard'
import { CARD_ACTION_CLASSES } from '@/lib/constants/formStyles'

export function ProfilePasswordCard() {
  const [isSaved, setIsSaved] = useState(false)
  const { changePassword, error } = useChangePassword()
  const methods = useForm<ChangePasswordValues>({ resolver: zodResolver(changePasswordSchema) })
  const { isSubmitting, isDirty } = methods.formState
  const [current, next, confirm] = methods.watch([
    'currentPassword',
    'newPassword',
    'confirmPassword',
  ])

  async function onSubmit(values: ChangePasswordValues) {
    setIsSaved(false)
    const ok = await changePassword(values)
    if (!ok) return
    methods.reset({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setIsSaved(true)
  }

  // A wrong current password belongs next to the field it refers to.
  const isWrongCurrent = error === 'Current password is incorrect'

  return (
    <SectionCard
      title="Change password"
      description="You need your current password to set a new one."
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          {isSaved && !isDirty && <FormAlert variant="success" message="Password updated." />}
          {error && !isWrongCurrent && <FormAlert message={error} />}

          <CurrentPasswordField />
          {isWrongCurrent && <p className="text-red-600 text-xs -mt-3">{error}</p>}
          <NewPasswordFields showStrength />
          <PasswordChecklist
            checks={getPasswordChecks(next ?? '', confirm ?? '', current ?? '')}
          />

          <button type="submit" disabled={isSubmitting} className={CARD_ACTION_CLASSES}>
            {isSubmitting ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </FormProvider>
    </SectionCard>
  )
}
