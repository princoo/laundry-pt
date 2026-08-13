"use client";

import { useCallback, useEffect, useState } from "react";
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

// The catalogue is loaded whole rather than paged: the page is a single
// drag-to-reorder list, so every row has to be in memory to drag between any
// two positions. The catalogue is small and bounded, so this is cheap.
export function useAdminItems() {
  const [items, setItems] = useState<AdminItem[]>([]);
  const [total, setTotal] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Same shape as usePagedFetch: every setState happens in an async callback,
  // not synchronously in the effect, and a cancelled flag drops a response that
  // arrives after unmount.
  const load = useCallback(() => {
    let cancelled = false;
    apiFetch("/api/admin/items")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setItems(data.items);
        setTotal(data.total);
        setActiveCount(data.activeCount);
        setFetchError(null);
      })
      .catch(() => {
        if (!cancelled) setFetchError("Failed to load items.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => load(), [load]);

  // activeCount is a server figure, so the optimistic flip has to move it too-
  // otherwise the header contradicts the toggle the admin just clicked.
  const toggleActive = useCallback(async (id: string, isActive: boolean) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, isActive } : i)));
    setActiveCount((c) => c + (isActive ? 1 : -1));
    try {
      const res = await apiFetch(`/api/admin/items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, isActive: !isActive } : i)),
      );
      setActiveCount((c) => c + (isActive ? -1 : 1));
      setError("Could not update item. Try again.");
    }
  }, []);

  // Optimistic like toggleActive: the list jumps to the new order immediately,
  // and reverts to exactly where it was if the write fails.
  const reorder = useCallback(async (orderedIds: string[]) => {
    let previous: AdminItem[] = [];
    setItems((prev) => {
      previous = prev;
      const byId = new Map(prev.map((i) => [i.id, i]));
      return orderedIds.map((id) => byId.get(id)!);
    });
    try {
      const res = await apiFetch("/api/admin/items/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setItems(previous);
      setError("Could not save the new order. Try again.");
    }
  }, []);

  return {
    items,
    total,
    activeCount,
    isLoading,
    fetchError,
    error,
    refetch: load,
    toggleActive,
    reorder,
    clearError: () => setError(null),
  };
}
