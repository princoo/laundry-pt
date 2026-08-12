"use client";

import { useCallback, useState } from "react";
import { usePagedFetch } from "@/lib/hooks/usePagedFetch";
import { apiFetch } from "@/lib/apiClient";

export interface AdminItem {
  id: string;
  nameEn: string;
  nameFr: string;
  priceNormal: number | null;
  priceDryClean: number | null;
  pricePressing: number | null;
  isActive: boolean;
  sortOrder: number;
}

export function useAdminItems(page: number) {
  const {
    rows: items,
    setRows: setItems,
    total,
    totalPages,
    activeCount,
    adjustActiveCount,
    isLoading,
    error: fetchError,
    refetch,
  } = usePagedFetch<AdminItem>(
    "/api/admin/items",
    "items",
    page,
    "Failed to load items.",
  );
  const [error, setError] = useState<string | null>(null);

  // activeCount is a server figure, so the optimistic flip has to move it too-
  // otherwise the header contradicts the toggle the admin just clicked.
  const toggleActive = useCallback(
    async (id: string, isActive: boolean) => {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, isActive } : i)),
      );
      adjustActiveCount(isActive ? 1 : -1);
      try {
        const res = await apiFetch(`/api/admin/items/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive }),
        });
        if (!res.ok) throw new Error("Failed to update item");
      } catch {
        setItems((prev) =>
          prev.map((i) => (i.id === id ? { ...i, isActive: !isActive } : i)),
        );
        adjustActiveCount(isActive ? -1 : 1);
        setError("Could not update item. Try again.");
      }
    },
    [setItems, adjustActiveCount],
  );

  return {
    items,
    total,
    totalPages,
    activeCount,
    isLoading,
    fetchError,
    error,
    refetch,
    toggleActive,
    clearError: () => setError(null),
  };
}
