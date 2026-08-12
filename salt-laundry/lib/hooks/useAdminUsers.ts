'use client'

import { usePagedFetch } from '@/lib/hooks/usePagedFetch'
import type { StaffUser } from '@/lib/types/staffUser'

export function useAdminUsers(page: number) {
  const { rows: users, total, totalPages, activeCount, isLoading, error, refetch } =
    usePagedFetch<StaffUser>('/api/admin/users', 'users', page, 'Failed to load staff accounts.')

  return { users, total, totalPages, activeCount, isLoading, error, refetch }
}
