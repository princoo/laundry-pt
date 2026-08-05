'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { staffLoginSchema, type StaffLoginValues } from '@/lib/validations/staffLogin.schema'
import { StaffLoginFields } from '@/components/staff/StaffLoginFields'
import { FormAlert } from '@/components/ui/FormAlert'
import { PRIMARY_BUTTON_CLASSES } from '@/lib/constants/formStyles'

export function StaffLoginForm() {
  const router = useRouter()
  const [hasAuthError, setHasAuthError] = useState(false)
  const methods = useForm<StaffLoginValues>({ resolver: zodResolver(staffLoginSchema) })
  const { isSubmitting } = methods.formState

  async function onSubmit(values: StaffLoginValues) {
    setHasAuthError(false)
    const result = await signIn('credentials', { ...values, redirect: false })

    if (result?.error) {
      setHasAuthError(true)
    } else {
      router.push('/staff')
      router.refresh()
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <FormAlert message={hasAuthError ? 'Incorrect email or password.' : null} />

        <StaffLoginFields />

        <button type="submit" disabled={isSubmitting} className={PRIMARY_BUTTON_CLASSES}>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </FormProvider>
  )
}
