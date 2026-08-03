'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession, signOut } from 'next-auth/react'
import { changePasswordSchema, type ChangePasswordValues } from '@/lib/validations/profile.schema'
import { useChangePassword } from '@/lib/hooks/useChangePassword'
import { getPasswordChecks } from '@/lib/utils/password'
import { CurrentPasswordField } from '@/components/staff/CurrentPasswordField'
import { NewPasswordFields } from '@/components/staff/NewPasswordFields'
import { PasswordChecklist } from '@/components/ui/PasswordChecklist'
import { FormAlert } from '@/components/ui/FormAlert'
import { FormStep } from '@/components/ui/FormStep'
import { PRIMARY_BUTTON_CLASSES } from '@/lib/constants/formStyles'

export function ChangePasswordForm() {
  const { update } = useSession()
  const { changePassword, error } = useChangePassword()
  const methods = useForm<ChangePasswordValues>({ resolver: zodResolver(changePasswordSchema) })
  const { isSubmitting } = methods.formState
  const [current, next, confirm] = methods.watch([
    'currentPassword',
    'newPassword',
    'confirmPassword',
  ])

  async function onSubmit(values: ChangePasswordValues) {
    const ok = await changePassword(values)
    if (!ok) return
    // Refresh the token first — the proxy reads mustChangePassword from it and
    // would bounce us straight back here otherwise. update() must be given a
    // payload: with no argument next-auth sends a GET and the jwt callback
    // never sees trigger: 'update'.
    const refreshed = await update({ mustChangePassword: false })

    // If the token somehow didn't refresh, the proxy would bounce us back here
    // with nothing to show for it. The new password already works, so send them
    // through the front door instead of leaving them stuck.
    if ((refreshed?.user as any)?.mustChangePassword !== false) {
      await signOut({ callbackUrl: '/staff/login' })
      return
    }

    // A full document navigation, not router.push: the session cookie just
    // changed, and the client router cache still holds the redirect the proxy
    // issued for /staff while the flag was set. Pushing lands us back here.
    window.location.assign('/staff')
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
        <FormAlert message={error} />

        <FormStep step={1} title="Confirm it's you">
          <CurrentPasswordField label="Temporary password" />
        </FormStep>

        <div className="border-t-[0.5px] border-salt-border" />

        <FormStep step={2} title="Choose a new password">
          <NewPasswordFields showStrength />
          <PasswordChecklist
            checks={getPasswordChecks(next ?? '', confirm ?? '', current ?? '')}
          />
        </FormStep>

        <button type="submit" disabled={isSubmitting} className={PRIMARY_BUTTON_CLASSES}>
          {isSubmitting ? 'Saving…' : 'Set password'}
        </button>
      </form>
    </FormProvider>
  )
}
