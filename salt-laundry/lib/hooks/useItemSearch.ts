"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { searchItems } from "@/lib/utils/itemSearch";
import type { LaundryItemOption } from "@/lib/types/guestOrder";

// Type-ahead over the catalogue. Focus never leaves the input- the arrow keys
// move a highlight instead, so the guest can keep typing, and picking clears the
// field so the next item can be typed straight away.
export function useItemSearch(
  items: readonly LaundryItemOption[],
  onPick: (item: LaundryItemOption) => void,
) {
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = searchItems(items, query);
  const isOpen = results.length > 0;

  const changeQuery = (value: string) => {
    setQuery(value);
    setHighlight(0);
  };

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setQuery("");
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [isOpen]);

  const pick = (item: LaundryItemOption) => {
    onPick(item);
    setQuery("");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setQuery("");
      return;
    }
    if (!isOpen) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlight((index) => Math.min(index + 1, results.length - 1));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlight((index) => Math.max(index - 1, 0));
    }
    if (event.key === "Enter") {
      // Stop the form from submitting- Enter here means "add this item".
      event.preventDefault();
      const item = results[highlight];
      if (item) pick(item);
    }
  };

  return {
    query,
    changeQuery,
    results,
    isOpen,
    highlight,
    setHighlight,
    pick,
    onKeyDown,
    containerRef,
  };
}
