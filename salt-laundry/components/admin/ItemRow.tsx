"use client";

import { useRouter } from "next/navigation";
import { Pencil, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ActiveToggle } from "@/components/ui/ActiveToggle";
import { PermissionGate } from "@/components/ui/PermissionGate";
import { formatCurrency } from "@/lib/utils/formatting";
import type { AdminItem } from "@/lib/hooks/useAdminItems";

interface Props {
  item: AdminItem;
  onToggle: (id: string, isActive: boolean) => void;
  onEdit: (item: AdminItem) => void;
}

function PriceCell({ price }: { price: number | null }) {
  if (price === null || price === 0) {
    return <span className="text-salt-text-muted">—</span>;
  }
  return <span className="text-salt-text">{formatCurrency(price)}</span>;
}

export function ItemRow({ item, onToggle, onEdit }: Props) {
  const router = useRouter();
  const goToDetail = () => router.push(`/staff/items/${item.id}`);
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") goToDetail();
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  // Translate the row in place while dragging- no DragOverlay- so it keeps the
  // table's column widths instead of collapsing.
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // Lift the dragged row above its neighbours.
    ...(isDragging ? { position: "relative" as const, zIndex: 1 } : {}),
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      tabIndex={0}
      onClick={goToDetail}
      onKeyDown={onKey}
      className={`border-b border-[0.5px] border-salt-border last:border-0 cursor-pointer hover:bg-salt-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-salt-navy transition-colors ${!item.isActive ? "bg-salt-cream/40" : ""} ${isDragging ? "bg-white shadow-md" : ""}`}
    >
      <td
        className="py-4 pl-4 pr-1 w-8"
        onClick={(e) => e.stopPropagation()}
      >
        <PermissionGate permission="LAUNDRY_REQUEST_ITEMS_CATALOGUE_MANAGE">
          <button
            type="button"
            aria-label={`Drag to reorder ${item.nameEn}`}
            className="w-6 h-8 inline-flex items-center justify-center text-salt-text-muted hover:text-salt-text cursor-grab active:cursor-grabbing touch-none"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-4 h-4" />
          </button>
        </PermissionGate>
      </td>
      <td className="py-4 px-5">
        <div
          className={`font-medium ${item.isActive ? "text-salt-text" : "text-salt-text-muted"}`}
        >
          {item.nameEn}
        </div>
        <div className="text-xs text-salt-text-muted mt-0.5">{item.nameFr}</div>
      </td>
      <td className="py-4 px-5 whitespace-nowrap">
        <PriceCell price={item.priceNormal} />
      </td>
      <td className="py-4 px-5 whitespace-nowrap">
        <PriceCell price={item.priceDryClean} />
      </td>
      <td className="py-4 px-5 whitespace-nowrap">
        <PriceCell price={item.pricePressing} />
      </td>
      <td className="py-4 px-5" onClick={(e) => e.stopPropagation()}>
        <PermissionGate permission="LAUNDRY_REQUEST_ITEMS_CATALOGUE_MANAGE">
          <ActiveToggle
            checked={item.isActive}
            onChange={() => onToggle(item.id, !item.isActive)}
          />
        </PermissionGate>
      </td>
      <td className="py-4 px-5" onClick={(e) => e.stopPropagation()}>
        <PermissionGate permission="LAUNDRY_REQUEST_ITEMS_CATALOGUE_MANAGE">
          <button
            type="button"
            onClick={() => onEdit(item)}
            aria-label={`Edit ${item.nameEn}`}
            className="w-8 h-8 inline-flex items-center justify-center rounded-md text-salt-text-sec hover:text-salt-navy hover:bg-salt-cream transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </PermissionGate>
      </td>
    </tr>
  );
}
