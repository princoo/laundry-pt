'use client'

import { usePagedFetch } from '@/lib/hooks/usePagedFetch'
import type { Role } from '@prisma/client'

export interface AdminUser {
  id: string
  name: string | null
  email: string
  role: Role
  isActive: boolean
  isAvailable: boolean
}

export function useAdminUsers(page: number) {
  const { rows: users, total, totalPages, activeCount, isLoading, error, refetch } =
    usePagedFetch<AdminUser>('/api/admin/users', 'users', page, 'Failed to load staff accounts.')

  return { users, total, totalPages, activeCount, isLoading, error, refetch }
}
