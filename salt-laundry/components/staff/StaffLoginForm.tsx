'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { staffLoginSchema, type StaffLoginValues } from '@/lib/validations/staffLogin.schema'
import { StaffLoginFields } from '@/components/staff/StaffLoginFields'

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
        {hasAuthError && (
          <div className="bg-red-50 border border-[0.5px] border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            Incorrect email or password.
          </div>
        )}

        <StaffLoginFields />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-salt-navy hover:bg-salt-navy-hover transition-colors text-white rounded-lg py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
        >
          {isSubmitting && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </FormProvider>
  )
}
